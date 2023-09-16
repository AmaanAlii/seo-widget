import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

import MainDataCard from "./Components/MainDataCard/mainDataCard";
import GeneralDataCard from "./Components/GeneralDataCard/generalDataCard";

function App() {
  const [url, setUrl] = useState("");
  const [seoData, setSeoData] = useState(null); // State to store SEO data
  const [crawlStatus, setCrawlStatus] = useState("finished");
  const [error, setError] = useState(null);

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
    setError(null);
  };

  function formatKey(key) {
    // Split the key by underscores
    const words = key.split("_");

    // Capitalize the first letter of each word and join them with a space
    return words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  useEffect(() => {
    setCrawlStatus("finished");
  }, []);

  useEffect(() => {
    if (seoData !== null) {
      setCrawlStatus("finished");
    }
  }, [seoData]);

  const post_data = [
    {
      target: url,
      max_crawl_pages: 10,
      load_resources: true,
      enable_javascript: true,
      enable_browser_rendering: true,
      custom_js: "meta = {}; meta.url = document.URL; meta;",
      tag: "some_string_123",
    },
  ];

  const isUrlValid = (url) => {
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
    return urlPattern.test(url);
  };

  const fetchSeoData = (taskId) => {
    axios({
      method: "get",
      url: `https://api.dataforseo.com/v3/on_page/summary/${taskId}`,
      auth: {
        username: "ali.officialmail.in@gmail.com", // Replace with your DataForSEO username
        password: "a586360c2d0d2d2f", // Replace with your DataForSEO password
      },
      headers: {
        "content-type": "application/json",
      },
    })
      .then(function (response) {
        var result = response["data"]["tasks"][0];
        if (
          result.status_message === "Ok." &&
          result.result[0].crawl_progress === "finished"
        ) {
          setCrawlStatus("finished");
          setSeoData(result.result[0]);
        } else {
          setTimeout(() => fetchSeoData(taskId), 5000);
        }
      })
      .catch(function (error) {
        setCrawlStatus("finished");
        console.log(error);
        setError("An error occurred while fetching SEO data.");
      });
  };

  const handleCheckSeo = () => {
    if (!url) {
      setError("Please enter a URL"); // Display an error if URL is empty
      setCrawlStatus("finished");
      return;
    } else if (!isUrlValid(url)) {
      setError("Please enter a valid URL");
      setCrawlStatus("finished");
      return;
    } else {
      setError(null); // Clear any previous error
      setCrawlStatus("in progress");
      axios({
        method: "post",
        url: "https://api.dataforseo.com/v3/on_page/task_post",
        auth: {
          username: "ali.officialmail.in@gmail.com", // Replace with your DataForSEO username
          password: "a586360c2d0d2d2f", // Replace with your DataForSEO password
        },
        data: post_data,
        headers: {
          "content-type": "application/json",
        },
      })
        .then(function (response) {
          if (
            response &&
            response.data.tasks &&
            response.data.tasks.length > 0
          ) {
            const taskId = response.data.tasks[0].id;

            // Calling the function to fetch SEO data using the task ID
            fetchSeoData(taskId);
          }
        })
        .catch(function (error) {
          setError("An error occurred while starting SEO check.");
          setCrawlStatus("finished");
          console.log(error);
        });
    }
  };
  return (
    <div className="App">
      <h2>SEO Widget</h2>
      <div className="seo-main-section">
        <div className="seo-header-input">
          <label htmlFor="urlInput">Enter URL:</label>
          <input
            type="text"
            id="urlInput"
            placeholder="Example: example.com"
            value={url}
            onChange={handleUrlChange}
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button onClick={() => handleCheckSeo()}>Check SEO</button>
      </div>
      {crawlStatus === "in progress" && (
        <div className="seo-waiting-loading-section">
          <div className="seo-waiting-revolver"></div>
          <p>Checking SEO... Please wait</p>
        </div>
      )}
      {seoData !== null && crawlStatus === "finished" && (
        <div className="seo-data-section">
          <h1>SEO Results:</h1>
          <div className="seo-main-data">
            <MainDataCard
              heading="On Page Score"
              score={seoData.page_metrics.onpage_score}
            />
          </div>
          <h2>Page Metrics:</h2>

          <div className="seo-general-data">
            {Object.entries(seoData.page_metrics)
              .filter(([key]) => key !== "checks" && key !== "onpage_score") // Filter out the "checks" object
              .map(([key, value], index) => (
                <GeneralDataCard
                  key={index}
                  heading={formatKey(key)}
                  score={value}
                />
              ))}
          </div>
          <h2>SEO Checks:</h2>
          <div className="seo-checks-data">
            {Object.entries(seoData.page_metrics.checks).map(
              ([key, value], index) => (
                <GeneralDataCard
                  key={index}
                  heading={formatKey(key)}
                  score={value}
                />
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
