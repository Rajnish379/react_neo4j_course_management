import React, { useState ,useEffect} from 'react';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router-dom';


import HeroImage from '../../images/School.jpg'
import './Home.css'
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import Spinner from '../spinner/Spinner';
const Home = () => {

  const {auth,setAuth} = useAuth();

  const [isLoading,setIsLoading] = useState(false);
  const [courseData,setCourseData] = useState();

  const axiosPrivate = useAxiosPrivate();

  const fetchCourses = async () => {
    setIsLoading(true);
    const response = await axiosPrivate.get("/api/v1/courses/");

    const cData = response.data;

    setCourseData(cData);
    setIsLoading(false);


  }

  useEffect(() => {
    if(auth?.user) {
      fetchCourses();
    }
  },[])

  return (
    <>
    <Spinner loadSpinner={isLoading}/>
    <main className = "container">
    {
      // If the user is not logged in then the HeroImage is displayed 
      // Else the You are logged in text will be displayed instead of the image
      !auth?.user?
      <img src={HeroImage} alt="" />
      :
      (courseData)?
      courseData.map((d) => {
        return (
          <div key={d.identifier} className="card mt-2">
            <div className="card-header-layout">
            <p className="card-header text-secondary bg-white">
              <span className="course-title">
                <Link to ={`/Course/${d.identifier}`}>
                {d.title}
                </Link>
              </span>
            </p>

          </div>
          <div>
            <hr />
            {
              d.lessons.map((l) => {
                return (
                  <div key={l.identifier} className="mt-2 text-center">
                    <h5 className="card-title mt-2">
                      <span className="text-dark">{l.title}</span>
                    </h5>
                    </div>
                )
              })
            }
          </div>
          <hr />
          </div>
        )
      })
      : null
    }
    </main>
    </>


  );
}

export default Home