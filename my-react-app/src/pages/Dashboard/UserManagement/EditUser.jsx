import "./EditUser.css";
import { useState } from "react";
import axios from "axios";

import {
  FaArrowLeft,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaWifi,
  FaCamera,
  FaTrash,
  FaCheckCircle,
  FaCalendarAlt,
  FaSave,
} from "react-icons/fa";


const API_URL = "http://127.0.0.1:5000";


function EditUser({ user, onClose }) {

  if (!user) return null;


  // =====================================================
  // USER DATA
  // =====================================================

  const [fullName, setFullName] = useState(
    user.fullName || user.name || ""
  );

  const [contactNo, setContactNo] = useState(
    user.contactNo || user.mobile || ""
  );

  const [email, setEmail] = useState(
    user.email || ""
  );

  const [nfcID, setNfcID] = useState(
    user.NFCID || user.nfc || ""
  );

  const [status, setStatus] = useState(
    user.status || "Active"
  );


  // =====================================================
  // PHOTO
  // =====================================================

  const [photo, setPhoto] = useState(
    user.photo || null
  );


  // =====================================================
  // LOADING / MESSAGE
  // =====================================================

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");


  // =====================================================
  // TOKEN
  // =====================================================

  const token = sessionStorage.getItem("token");

  const systemID =
    sessionStorage.getItem("systemID");


  // =====================================================
  // HANDLE PHOTO
  // =====================================================

  const handlePhotoChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;


    // Maximum 2MB

    if (file.size > 2 * 1024 * 1024) {

      setError(
        "Photo size must be less than 2MB."
      );

      return;

    }


    setError("");


    const imageURL =
      URL.createObjectURL(file);

    setPhoto(imageURL);

  };


  // =====================================================
  // REMOVE PHOTO
  // =====================================================

  const handleRemovePhoto = () => {

    setPhoto(null);

  };


  // =====================================================
  // UPDATE USER
  // =====================================================

  const handleUpdate = async () => {

    try {

      setLoading(true);

      setMessage("");

      setError("");


      // -----------------------------------------------
      // VALIDATION
      // -----------------------------------------------

      if (!fullName.trim()) {

        setError("Full Name is required.");

        setLoading(false);

        return;

      }


      if (!contactNo.trim()) {

        setError(
          "Contact Number is required."
        );

        setLoading(false);

        return;

      }


      if (!email.trim()) {

        setError(
          "Email Address is required."
        );

        setLoading(false);

        return;

      }


      if (!user.userID) {

        setError(
          "User ID is missing."
        );

        setLoading(false);

        return;

      }


      // -----------------------------------------------
      // API
      // -----------------------------------------------

      const response = await axios.put(

        `${API_URL}/system/users/${user.userID}`,

        {
          sysID: systemID,

          fullName: fullName.trim(),

          contactNo: contactNo.trim(),

          email: email.trim(),

          NFCID: nfcID.trim(),

          status: status
        },

        {
          headers: {
            Authorization:
              `Bearer ${token}`,

            "Content-Type":
              "application/json"
          }
        }

      );


      console.log(
        "Update user response:",
        response.data
      );


      // -----------------------------------------------
      // SUCCESS
      // -----------------------------------------------

      if (response.data.success) {

        setMessage(
          response.data.message ||
          "User updated successfully."
        );


        // Close page after successful update

        setTimeout(() => {

          onClose();

        }, 1000);


      } else {

        setError(
          response.data.message ||
          "Unable to update user."
        );

      }


    } catch (err) {

      console.error(
        "Update user error:",
        err
      );


      setError(
        err.response?.data?.message ||
        "Unable to connect to backend."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // DELETE USER
  // =====================================================

  const handleDelete = async () => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this user?"
      );


    if (!confirmDelete) return;


    try {

      setLoading(true);

      setMessage("");

      setError("");


      const response = await axios.delete(

        `${API_URL}/system/users/${user.userID}`,

        {
          params: {
            sysID: systemID
          },

          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }

      );


      console.log(
        "Delete user response:",
        response.data
      );


      if (response.data.success) {

        setMessage(
          response.data.message ||
          "User deleted successfully."
        );


        setTimeout(() => {

          onClose();

        }, 1000);


      } else {

        setError(
          response.data.message ||
          "Unable to delete user."
        );

      }


    } catch (err) {

      console.error(
        "Delete user error:",
        err
      );


      setError(
        err.response?.data?.message ||
        "Unable to delete user."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // MAIN UI
  // =====================================================

  return (

    <div className="editUserPage">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="editHeader">

        <div className="leftHeader">

          <button
            className="backBtn"
            onClick={onClose}
            type="button"
          >

            <FaArrowLeft />

          </button>


          <div>

            <h2>
              Edit User
            </h2>

            <p>
              Update user information and details
            </p>

          </div>

        </div>


        <div className="breadcrumb">

          Users &gt; Edit User

        </div>

      </div>


      {/* =================================================
          MESSAGES
      ================================================= */}

      {error && (

        <div className="errorMessage">

          {error}

        </div>

      )}


      {message && (

        <div className="successMessage">

          {message}

        </div>

      )}


      {/* =================================================
          MAIN CARD
      ================================================= */}

      <div className="editCard">


        {/* =================================================
            FORM
        ================================================= */}

        <div className="formGrid">


          {/* FULL NAME */}

          <div className="formGroup">

            <label>
              Full Name *
            </label>


            <div className="inputBox">

              <FaUser />

              <input
                type="text"
                value={fullName}
                onChange={(e) =>
                  setFullName(e.target.value)
                }
                placeholder="Enter Full Name"
              />

            </div>

          </div>


          {/* CONTACT */}

          <div className="formGroup">

            <label>
              Contact Number *
            </label>


            <div className="inputBox">

              <FaPhone />

              <input
                type="text"
                value={contactNo}
                onChange={(e) =>
                  setContactNo(e.target.value)
                }
                placeholder="Enter Mobile Number"
              />

            </div>

          </div>


          {/* EMAIL */}

          <div className="formGroup">

            <label>
              Email Address *
            </label>


            <div className="inputBox">

              <FaEnvelope />

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter Email"
              />

            </div>

          </div>


          {/* NFC */}

          <div className="formGroup">

            <label>
              NFC Card UID
            </label>


            <div className="nfcRow">

              <div className="inputBox">

                <FaWifi />

                <input
                  type="text"
                  value={nfcID}
                  onChange={(e) =>
                    setNfcID(e.target.value)
                  }
                  placeholder="Scan NFC Card"
                />

              </div>


              <button
                type="button"
                className="scanBtn"
                onClick={() => {
                  alert(
                    "Connect your NFC reader here."
                  );
                }}
              >

                <FaWifi />

                Scan NFC Card

              </button>

            </div>

          </div>


        </div>


        {/* =================================================
            PHOTO + FACE
        ================================================= */}

        <div className="twoCards">


          {/* USER PHOTO */}

          <div className="photoCard">

            <h3>
              User Photo
            </h3>


            {photo ? (

              <img
                src={photo}
                alt={fullName}
                className="userPhoto"
              />

            ) : (

              <div className="noPhoto">

                No Photo

              </div>

            )}


            <div className="photoBtns">


              {/* CHANGE PHOTO */}

              <label
                className="blueBtn"
                style={{
                  cursor: "pointer"
                }}
              >

                <FaCamera />

                Change Photo

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handlePhotoChange}
                  style={{
                    display: "none"
                  }}
                />

              </label>


              {/* REMOVE PHOTO */}

              <button
                type="button"
                className="redBtn"
                onClick={
                  handleRemovePhoto
                }
              >

                <FaTrash />

                Remove Photo

              </button>

            </div>


            <p>
              JPG, PNG or JPEG (Maximum 2MB)
            </p>

          </div>


          {/* FACE */}

          <div className="faceCard">

            <h3>
              Face Registration
            </h3>


            <div className="faceStatus">

              <FaCheckCircle />


              <span>

                {user.face === "Registered"

                  ? "Face Registered"

                  : "Face Not Registered"

                }

              </span>


              <p>

                Face registration status

              </p>

            </div>


            <div className="photoBtns">


              <button
                type="button"
                className="blueBtn"
                onClick={() => {

                  alert(
                    "Connect your face capture system here."
                  );

                }}
              >

                <FaCamera />

                Recapture Face

              </button>


              <button
                type="button"
                className="redBtn"
                onClick={() => {

                  alert(
                    "Face data removal API can be connected here."
                  );

                }}
              >

                <FaTrash />

                Remove Face Data

              </button>

            </div>


            <p>

              Make sure your face is clearly
              visible before saving.

            </p>

          </div>

        </div>


        {/* =================================================
            STATUS
        ================================================= */}

        <div className="bottomRow">


          <div className="statusSection">

            <label>
              Status *
            </label>


            <div className="radioGroup">


              <label>

                <input
                  type="radio"
                  name="status"
                  value="Active"
                  checked={
                    status === "Active"
                  }
                  onChange={(e) =>
                    setStatus(e.target.value)
                  }
                />

                Active

              </label>


              <label>

                <input
                  type="radio"
                  name="status"
                  value="Inactive"
                  checked={
                    status === "Inactive"
                  }
                  onChange={(e) =>
                    setStatus(e.target.value)
                  }
                />

                Inactive

              </label>


            </div>

          </div>


          {/* REGISTER DATE */}

          <div className="registerDate">

            <label>
              Registered On
            </label>


            <div className="inputBox">

              <FaCalendarAlt />

              <input
                type="text"
                value={
                  user.createdDate ||
                  user.registeredOn ||
                  "--"
                }
                readOnly
              />

            </div>

          </div>

        </div>


      </div>


      {/* =================================================
          FOOTER
      ================================================= */}

      <div className="footerBtns">


        {/* CANCEL */}

        <button
          type="button"
          className="cancelBtn"
          onClick={onClose}
          disabled={loading}
        >

          Cancel

        </button>


        <div>


          {/* DELETE */}

          <button
            type="button"
            className="deleteBtn"
            onClick={handleDelete}
            disabled={loading}
          >

            <FaTrash />

            {loading
              ? "Please wait..."
              : "Delete User"
            }

          </button>


          {/* UPDATE */}

          <button
            type="button"
            className="updateBtn"
            onClick={handleUpdate}
            disabled={loading}
          >

            <FaSave />

            {loading
              ? "Updating..."
              : "Update User"
            }

          </button>


        </div>

      </div>


    </div>

  );

}


export default EditUser;
