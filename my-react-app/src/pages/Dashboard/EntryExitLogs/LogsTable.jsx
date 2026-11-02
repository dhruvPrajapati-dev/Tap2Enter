import { useEffect, useState } from "react";
import axios from "axios";

import { FaRss } from "react-icons/fa";
import { LuScanFace } from "react-icons/lu";


function LogsTable({ filters }) {

  // ==========================================
  // STATES
  // ==========================================

  const [logs, setLogs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // ==========================================
  // API URL
  // ==========================================

  const API_URL = "http://127.0.0.1:5000";


  // ==========================================
  // FETCH LOGS WHEN FILTER CHANGES
  // ==========================================

  useEffect(() => {

    fetchLogs();

  }, [filters]);


  // ==========================================
  // FETCH LOGS
  // ==========================================

  const fetchLogs = async () => {

    try {

      setLoading(true);

      setError("");


      // ======================================
      // TOKEN
      // ======================================

      const token =
        sessionStorage.getItem("token");


      // ======================================
      // SYSTEM ID
      // ======================================

      const systemID =
        sessionStorage.getItem("systemID");


      // ======================================
      // API CALL
      // ======================================

      const response = await axios.get(

        `${API_URL}/public/logs`,

        {

          params: {

            systemID: systemID,

            startDate:
              filters?.startDate || "",

            endDate:
              filters?.endDate || "",

            type:
              filters?.type || "",

            method:
              filters?.method || "",

            search:
              filters?.search || ""

          },


          headers: {

            Authorization:
              `Bearer ${token}`

          }

        }

      );


      // ======================================
      // SET LOGS
      // ======================================

      setLogs(
        response.data.logs || []
      );


    } catch (err) {

      console.error(
        "Logs API Error:",
        err
      );


      setError(

        err.response?.data?.message ||

        "Unable to load logs"

      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="table-container">

        <p>
          Loading logs...
        </p>

      </div>

    );

  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error) {

    return (

      <div className="table-container">

        <p>
          {error}
        </p>

      </div>

    );

  }


  // ==========================================
  // TABLE
  // ==========================================

  return (

    <div className="table-container">

      <table>

        {/* ====================================
            TABLE HEADER
        ===================================== */}

        <thead>

          <tr>

            <th width="40px">
              #
            </th>

            <th>
              Name
            </th>

            <th>
              Method
            </th>

            <th>
              Status
            </th>

            <th>
              Entry Time
            </th>

            <th>
              Exit Time
            </th>

          </tr>

        </thead>


        {/* ====================================
            TABLE BODY
        ===================================== */}

        <tbody>


          {/* ==================================
              NO DATA
          =================================== */}

          {logs.length === 0 ? (

            <tr>

              <td
                colSpan="6"
                style={{
                  textAlign: "center"
                }}
              >

                No logs found

              </td>

            </tr>

          ) : (


            /* ================================
               LOG DATA
            ================================= */

            logs.map(
              (log, index) => (

                <tr
                  key={log.id}
                >


                  {/* ==========================
                      NUMBER
                  =========================== */}

                  <td>

                    {index + 1}

                  </td>


                  {/* ==========================
                      NAME
                  =========================== */}

                  <td className="name">

                    {log.fullName || "-"}

                    <p>

                      {log.user_id || "-"}

                    </p>

                  </td>


                  {/* ==========================
                      METHOD
                  =========================== */}

                  <td>

                    <span className="method">


                      {log.entryMethod
                        ?.toUpperCase() === "NFC"

                        ? <FaRss />

                        : <LuScanFace />

                      }


                      &nbsp;


                      {log.entryMethod || "-"}


                    </span>

                  </td>


                  {/* ==========================
                      STATUS
                  =========================== */}

                  <td>

                    <span

                      className={

                        log.status === "Inside"

                          ? "badge Inside"

                          : "badge Outside"

                      }

                    >

                      {log.status || "-"}

                    </span>

                  </td>


                  {/* ==========================
                      ENTRY TIME
                  =========================== */}

                  <td>

                    {log.entryTime || "-"}

                  </td>


                  {/* ==========================
                      EXIT TIME
                  =========================== */}

                  <td>

                    {log.exitTime || "-"}

                  </td>


                </tr>

              )

            )

          )}

        </tbody>

      </table>

    </div>

  );

}


export default LogsTable;