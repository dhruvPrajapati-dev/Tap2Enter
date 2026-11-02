import "./ViewUserModal.css";

import {
  FaTimes,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaIdCard,
  FaFingerprint,

} from "react-icons/fa";
import { LuScanFace } from 'react-icons/lu';

function ViewUserModal({ isOpen, onClose, user }) {
  if (!isOpen || !user) return null;

  return (
    <div className="modalOverlay">
      <div className="viewModal">

        <div className="modalHeader">
          <h2>View User</h2>

          <button className="closeBtn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modalBody">

          <div className="profileSection">
            <img
              src={user.photo}
              alt="profile"
              className="profileImage"
            />

            <h3>{user.fullName}</h3>

            <span className="activeBadge">
              {user.status}
            </span>
          </div>

          <div className="detailsGrid">

            <div className="detailCard">
              <FaIdCard />
              <div>
                <label>User ID</label>
                <p>{user.userID}</p>
              </div>
            </div>

            {/* <div className="detailCard">
              <FaUser />
              <div>
                <label>Department</label>
                <p>{user.department}</p>
              </div>
            </div> */}

            <div className="detailCard">
              <FaPhone />
              <div>
                <label>Mobile</label>
                <p>{user.contactNo}</p>
              </div>
            </div>

            <div className="detailCard">
              <FaEnvelope />
              <div>
                <label>Email</label>
                <p>{user.email}</p>
              </div>
            </div>

            <div className="detailCard">
              <FaFingerprint />
              <div>
                <label>NFC UID</label>
                <p>{user.NFCID}</p>
              </div>
            </div>

            <div className="detailCard">
              <LuScanFace />
              <div>
               
                <p><span
                      className={
                        user.face === "Face Registered"
                          ? "faceYes"
                          : "faceNo"
                      }
                    >
                      {user.face || "Face Not Registered"}
                    </span></p>
              </div>
            </div>

          </div>

        </div>

        {/* <div className="modalFooter">
          <button className="closeButton" onClick={onClose}>
            Close
          </button>
        </div> */}

      </div>
    </div>
  );
}

export default ViewUserModal;