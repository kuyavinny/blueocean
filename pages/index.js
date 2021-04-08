import React, { useState, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import CreateEvent from "./createEvent";
import { useSession } from "next-auth/client";
import Layout from "../components/Layout";
import EventsList from "../components/home/EventsList";
import "bootstrap/dist/css/bootstrap.min.css";

const requests = require("../handlers/requests");

export default function Home() {
  // User Hooks
  const [userName, setUserName] = useState("");
  const [userId, setuserId] = useState(39);
  const [host, setHost] = useState(false);
  const [session, loading] = useSession();

  // Event Hooks
  const [userEvents, setUserEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [modalShow, setModalShow] = React.useState(false);

  // Search Hooks
  const [search, setSearch] = useState("");

  useEffect(() => {
    // ----TO BE USED WITH NEXT.AUTH----

    // async function getData() {
    //   if (session) {
    //     await setUserName(session.user.name);

    //     await requests.fetchUserEvents(userId, (data) => {
    //       setUserEvents(data);
    //     });

    //     await requests.fetchAllEvents((data) => {
    //       setAllEvents(data);
    //     });
    //   }
    // }
    // getData();

    requests.getUserProfile("email@email.com", (data) => {
      setUserName(data[0].name);
      // setuserId(data[0].id);
      setHost(data[0].host_status);
    });

    requests.fetchUserEvents(userId, (data) => {
      setUserEvents(data);
    });

    requests.fetchAllEvents((data) => {
      setAllEvents(data);
    });

  }, [session]);

  useEffect(() => {
    if (search.length === 0) {
      requests.fetchAllEvents((data) => {
        setAllEvents(data);
      });
    }
    let searchResults = [];
    allEvents.forEach((event) => {
      for (let key in event) {
        let property = event[key];
        if (typeof property === "string") {
          if (
            property.includes(search) &&
            searchResults.indexOf(event) === -1
          ) {
            searchResults.push(event);
          }
        }
      }
    });
    setAllEvents(searchResults);
    console.log("done");
  }, [search]);

  // Wrap every page component in <Layout> tags (and import up top)
  // to have the nav bar up top
  return (
    <Layout userId={userId} setSearch={setSearch}>
      <div className={styles.container}>
        <Head>
          <title>My Dashboard</title>
        </Head>

        <div className={styles.main}>
          <div>
            <h5>All Events</h5>
            <div className="event-list">
              <EventsList events={allEvents} userId={userId} />
            </div>
          </div>
        </div>
        <footer className={styles.footer}></footer>
      </div>
    </Layout>
  );
}