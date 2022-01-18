import React, { useState, useEffect } from "react";
import Card from "../Card/Card";
import "./JobSection.css";
import { useQuery } from "@apollo/client";
import { JOB_LIST } from "../../GraphQL/query";
import Filter from "../Filter/Filter";
import NetworkMessage from "../NetworkMessage/NetworkMessage";

const filterValue = ["All", "All", "All", "All"];

const JobSection = () => {
  const { data, loading } = useQuery(JOB_LIST);

  const [jobs, setJobs] = useState();
  useEffect(() => {
    if (data) setJobs(data.allJob);
  }, [data]);

  const jobTypeDataforFilter = () => {
    return [
      ["jobType"],
      [...new Set(data?.allJob.map((item) => item.jobType.type))],
    ];
  };

  const jobSectorDataforFilter = () => {
    return [
      ["jobSector"],
      [...new Set(data?.allJob.map((item) => item.jobSector.sector))],
    ];
  };

  const jobLocationDataforFilter = () => {
    return [
      ["jobLocation"],
      [...new Set(data?.allJob.map((item) => item.jobLocation.location))],
    ];
  };

  const jobCategoryDataforFilter = () => {
    return [
      ["jobCategory"],
      [...new Set(data?.allJob.map((item) => item.jobCategory.category))],
    ];
  };

  const getAllIndexes = (arr, val) => {
    var indexes = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] !== val) {
        indexes.push(i);
      }
    }
    return indexes;
  };

  const handleChange = (event) => {
    let id = event.target.id;
    let a = event.target.value;
    if (id === "jobType") {
      filterValue[0] = a;
    } else if (id === "jobCategory") {
      filterValue[1] = a;
    } else if (id === "jobSector") {
      filterValue[2] = a;
    } else if (id === "jobLocation") {
      filterValue[3] = a;
    }
    if (filterValue.every((val) => val === "All")) {
      setJobs(data.allJob);
    } else if (filterValue.includes("All")) {
      var indexes = getAllIndexes(filterValue, "All");
      //console.log(indexes)
      //console.log(filterValue)
      const filteredData = data.allJob.filter((job) => {
        return (
          (indexes.includes(0) ? job.jobType.type === filterValue[0] : <></>) &&
          (indexes.includes(1) ? (
            job.jobCategory.category === filterValue[1]
          ) : (
            <></>
          )) &&
          (indexes.includes(2) ? (
            job.jobSector.sector === filterValue[2]
          ) : (
            <></>
          )) &&
          (indexes.includes(3) ? (
            job.jobLocation.location === filterValue[3]
          ) : (
            <></>
          ))
        );
      });
      setJobs(filteredData);
    } else {
      const filteredData = data.allJob.filter((job) => {
        return (
          job.jobType.type === filterValue[0] &&
          job.jobCategory.category === filterValue[1] &&
          job.jobSector.sector === filterValue[2] &&
          job.jobLocation.location === filterValue[3]
        );
      });
      setJobs(filteredData);
      //console.log(filterValue)
    }
  };

  if (loading) return <NetworkMessage message="Loading..." />;

  return jobs ? (
    <>
      <div className="filterSection">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h1>filter based on your interest</h1>
            </div>
          </div>
          <div className="row filterOptions">
            <div className="col-lg-3 col-md-3 col-sm-6 col-6">
              <p>Post Type</p>
              <Filter
                filterData={jobTypeDataforFilter()}
                change={handleChange}
              />
            </div>
            <div className="col-lg-3 col-md-3 col-sm-6 col-6">
              <p>Job category</p>
              <Filter
                filterData={jobCategoryDataforFilter()}
                change={handleChange}
              />
            </div>
            <div className="col-lg-3 col-md-3 col-sm-6 col-6">
              <p>Job Sector</p>
              <Filter
                filterData={jobSectorDataforFilter()}
                change={handleChange}
              />
            </div>
            <div className="col-lg-3 col-md-3 col-sm-6 col-6">
              <p>Job Location</p>
              <Filter
                filterData={jobLocationDataforFilter()}
                change={handleChange}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="jobSection">
        <div className="container">
          <div className="row">
            <p className="resultShowing">
              showing {jobs.length} of {jobs.length} total results
            </p>
            {jobs.map((job, i) => {
              return (
                <div key={job.id} className="col-lg-4">
                  <Card
                    postName={job.postName}
                    recruitmentBoard={job.recruitmentBoard}
                    jobLocation={job.jobLocation.location}
                    qualification={job.qualification}
                    applyBefore={job.applyBefore}
                    salary={job.salary}
                    minageLimit={job.minageLimit}
                    maxageLimit={job.maxageLimit}
                    vacancy={job.vacancy}
                    jobType={job.jobType.type}
                    jobSector={job.jobSector.sector}
                    jobCategory={job.jobCategory.category}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  ) : (
    <NetworkMessage message="Network error, Please check your internet connection." />
  );
};

export default JobSection;
