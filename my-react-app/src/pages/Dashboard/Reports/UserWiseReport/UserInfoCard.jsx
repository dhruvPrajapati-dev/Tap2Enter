import React from "react";
import "./UserInfoCard.css";

const UserInfoCard = ({ user }) => {
    // -----------------------------------------
    // No user selected
    // -----------------------------------------
    if (!user) {
        return (
            <div className="userInfoCard">
                <div className="cardHeader">
                    <h3>User Information</h3>
                </div>

                <div className="noUserMessage">
                    <p>No user information available.</p>
                </div>
            </div>
        );
    }

    // -----------------------------------------
    // User values
    // -----------------------------------------
    const userId = user.id || "-";
    const userName = user.name || "-";
    const mobile = user.mobile || "-";
    const email = user.email || "-";
    const nfc = user.nfc || "-";
    const face = user.face || "-";
    const status = user.status || "Unknown";
    const createdDate = user.createdDate || "-";

    // -----------------------------------------
    // Profile image
    // -----------------------------------------
    const profileImage = user.photo || user.face || null;

    // -----------------------------------------
    // Status
    // -----------------------------------------
    const isActive =
        String(status).toLowerCase() === "active";

    // -----------------------------------------
    // Format date
    // -----------------------------------------
    const formatDate = (date) => {
        if (!date || date === "-") {
            return "-";
        }

        try {
            const parsedDate = new Date(date);

            if (isNaN(parsedDate.getTime())) {
                return date;
            }

            return parsedDate.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });
        } catch (error) {
            return date;
        }
    };

    return (
        <div className="userInfoCard">

            {/* =====================================
                CARD HEADER
            ====================================== */}
            <div className="cardHeader">
                <h3>User Information</h3>

                <span
                    className={
                        isActive
                            ? "activeBadge"
                            : "activeBadge inactiveBadge"
                    }
                >
                    {status}
                </span>
            </div>

            {/* =====================================
                PROFILE SECTION
            ====================================== */}
            <div className="profileTop">

                {/* Profile Image */}
                {profileImage ? (
                    <img
                        src={profileImage}
                        alt={userName}
                        className="profilePhoto"
                        onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                        }}
                    />
                ) : null}

                {/* Default Profile Icon */}
                <div
                    className="profilePhoto defaultProfile"
                    style={{
                        display: profileImage ? "none" : "flex",
                    }}
                >
                    👤
                </div>

                {/* User Name */}
                <div className="userDetailsTop">
                    <h2>{userName}</h2>

                    <p>
                        User ID: {userId}
                    </p>
                </div>
            </div>

            {/* =====================================
                USER DETAILS
            ====================================== */}
            <div className="userDetails">

                {/* User ID */}
                <div className="detailRow">
                    <label>User ID</label>
                    <span className="colon">:</span>
                    <span>{userId}</span>
                </div>

                {/* Full Name */}
                <div className="detailRow">
                    <label>Full Name</label>
                    <span className="colon">:</span>
                    <span>{userName}</span>
                </div>

                {/* Mobile */}
                <div className="detailRow">
                    <label>Mobile Number</label>
                    <span className="colon">:</span>
                    <span>{mobile}</span>
                </div>

                {/* Email */}
                <div className="detailRow">
                    <label>Email</label>
                    <span className="colon">:</span>
                    <span>{email}</span>
                </div>

                {/* NFC */}
                <div className="detailRow">
                    <label>NFC ID</label>
                    <span className="colon">:</span>
                    <span>{nfc}</span>
                </div>

                {/* Face */}
                <div className="detailRow">
                    <label>Face Recognition</label>
                    <span className="colon">:</span>
                    <span>{face}</span>
                </div>

                {/* Status */}
                <div className="detailRow">
                    <label>Status</label>
                    <span className="colon">:</span>
                    <span>{status}</span>
                </div>

                {/* Registration Date */}
                <div className="detailRow">
                    <label>Registration Date</label>
                    <span className="colon">:</span>
                    <span>{formatDate(createdDate)}</span>
                </div>

            </div>
        </div>
    );
};

export default UserInfoCard;