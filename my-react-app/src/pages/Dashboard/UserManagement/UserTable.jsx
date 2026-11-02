import "./UserTable.css";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  FaEye,
  FaEdit
} from "react-icons/fa";


function UserTable({
  onView,
  onEdit,
  search,
  status
}) {

  // =====================================================
  // USERS
  // =====================================================

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =====================================================
  // SYSTEM ID
  // =====================================================

  const sysID = sessionStorage.getItem("systemID");


  // =====================================================
  // GET USERS
  // =====================================================

  const getUsers = async () => {

    try {

      setLoading(true);
      setError("");


      const token = sessionStorage.getItem("token");


      const response = await axios.get(
        "http://127.0.0.1:5000/system/users",
        {
          params: {
            sysID: sysID
          },

          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      console.log(
        "Backend response:",
        response.data
      );


      if (response.data.success) {

        setUsers(
          response.data.users || []
        );

      } else {

        setError(
          response.data.message ||
          "Unable to load users"
        );

      }

    } catch (error) {

      console.error(
        "Get users error:",
        error
      );


      setError(
        error.response?.data?.message ||
        "Unable to connect to backend"
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // LOAD USERS
  // =====================================================

  useEffect(() => {

    getUsers();

  }, []);


  // =====================================================
  // FILTER USERS
  // =====================================================

  const filteredUsers = users.filter((user) => {

    // ---------------------------------------------
    // SEARCH
    // ---------------------------------------------

    const searchText =
      (search || "").toLowerCase().trim();


    const matchesSearch =
      searchText === "" ||

      String(user.fullName || "")
        .toLowerCase()
        .includes(searchText) ||

      String(user.contactNo || "")
        .toLowerCase()
        .includes(searchText) ||

      String(user.email || "")
        .toLowerCase()
        .includes(searchText) ||

      String(user.userID || "")
        .toLowerCase()
        .includes(searchText) ||

      String(user.NFCID || "")
        .toLowerCase()
        .includes(searchText);


    // ---------------------------------------------
    // STATUS
    // ---------------------------------------------

    const matchesStatus =
      status === "All" ||
      String(user.status || "")
        .toLowerCase() ===
        String(status || "")
          .toLowerCase();


    return (
      matchesSearch &&
      matchesStatus
    );

  });


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="tableCard">

        <div className="tableHeader">

          <div>

            <h2>
              Registered Users
            </h2>

            <p>
              Loading users...
            </p>

          </div>

        </div>

      </div>

    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (

      <div className="tableCard">

        <div className="tableHeader">

          <div>

            <h2>
              Registered Users
            </h2>

            <p>
              {error}
            </p>

          </div>


          <button
            onClick={getUsers}
          >
            Retry
          </button>

        </div>

      </div>

    );

  }


  // =====================================================
  // TABLE
  // =====================================================

  return (

    <div className="tableCard">


      {/* =================================================
          TABLE HEADER
      ================================================= */}

      <div className="tableHeader">

        <div>

          <h2>
            Registered Users
          </h2>

          <p>
            Showing {filteredUsers.length} of{" "}
            {users.length} users
          </p>

        </div>

      </div>


      {/* =================================================
          TABLE
      ================================================= */}

      <div className="tableResponsive">

        <table>

          <thead>

            <tr>

              <th>User</th>

              <th>Mobile</th>

              <th>NFC UID</th>

              <th>Face</th>

              <th>Status</th>

              <th>Action</th>

            </tr>

          </thead>


          <tbody>


            {/* =================================================
                NO RESULTS
            ================================================= */}

            {filteredUsers.length === 0 ? (

              <tr>

                <td
                  colSpan="6"
                  style={{
                    textAlign: "center"
                  }}
                >

                  No users found.

                </td>

              </tr>

            ) : (


              /* =================================================
                 USERS
              ================================================= */

              filteredUsers.map((user) => (

                <tr
                  key={user.userID}
                >


                  {/* =============================================
                      USER
                  ============================================= */}

                  <td className="userCell">

                    <div>

                      <h4>
                        {user.fullName}
                      </h4>

                      <p>
                        {user.userID}
                      </p>

                    </div>

                  </td>


                  {/* =============================================
                      MOBILE
                  ============================================= */}

                  <td>

                    {user.contactNo || "--"}

                  </td>


                  {/* =============================================
                      NFC
                  ============================================= */}

                  <td>

                    <span className="nfcBadge">

                      {user.NFCID || "--"}

                    </span>

                  </td>


                  {/* =============================================
                      FACE
                  ============================================= */}

                  <td>

                    <span
                      className={
                        user.face === "Registered"
                          ? "faceYes"
                          : "faceNo"
                      }
                    >

                      {user.face || "Not Registered"}

                    </span>

                  </td>


                  {/* =============================================
                      STATUS
                  ============================================= */}

                  <td>

                    <span
                      className={
                        user.status === "Active"
                          ? "active"
                          : "inactive"
                      }
                    >

                      {user.status || "--"}

                    </span>

                  </td>


                  {/* =============================================
                      ACTION
                  ============================================= */}

                  <td>

                    <div className="actionBtns">


                      {/* VIEW */}

                      <button
                        className="viewBtn"
                        onClick={() =>
                          onView(user)
                        }
                        title="View User"
                      >

                        <FaEye />

                      </button>


                      {/* EDIT */}

                      <button
                        className="edit"
                        onClick={() =>
                          onEdit(user)
                        }
                        title="Edit User"
                      >

                        <FaEdit />

                      </button>


                    </div>

                  </td>


                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}


export default UserTable;