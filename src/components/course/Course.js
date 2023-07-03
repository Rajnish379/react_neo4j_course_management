import React from 'react'
import { useEffect,useState } from 'react'
import useAuth from '../../hooks/useAuth'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useParams,useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'

import axios from 'axios'
import Spinner from '../spinner/Spinner'
const Course = () => {

    let params = useParams();
    let id = params.identifier;
    const [courseData,setCourseData] = useState();
    const axiosPrivate = useAxiosPrivate();
    const [isLoading,setIsLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {

        const fetchCourse = async () => {

            setIsLoading(true);

            const response = await axiosPrivate.get(`/api/v1/courses/${id}`);

            const cData = response.data;

            setCourseData(cData);

            setIsLoading(false);

            

        }

        fetchCourse();

    },[])

    const enroll = async (identifier,courseTitle) => {

      const postEnrollData = {
        "courseIdentifier": identifier
      };
      const resp = await axiosPrivate.post('/api/v1/enrollments/',postEnrollData);

      if(resp.status === 200) {
        alert(`Thank you for enrolling in our ${courseTitle} course`);
      
        navigate("/EnrolledCourses");
      }
    }
  return (
    <>
    <Spinner loadSpinner={isLoading}></Spinner>
    <main>{
    (courseData)?
    <div key={courseData.identifier} className="card mt-2">
    <div className="card-header-layout">
    <p className="card-header text-secondary bg-white">
      <span className="course-title">
       
        {courseData.title}
       
      </span> &nbsp;&nbsp; Instructor {courseData.teacher}
    </p>
    {
      // The below button will be displayed only when the user has not been enrolled in any course
     (!courseData.enrolled)?
      <Button variant='info' onClick={() => {enroll(id,courseData.title)}}>Enroll</Button>
     :
     null 
    }

  </div>
  <div>
    <hr />
    {
      courseData.lessons.map((l) => {
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
  : null
}</main>
  </>)
}

export default Course