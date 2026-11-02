import React, { useState } from "react";
import axios from "axios";
import {
  FiX,
  FiKey,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiAlertCircle,
  FiShield,
} from "react-icons/fi";

import "./Password.css";

const API_URL = "http://127.0.0.1:5000";

const getSystemID = () => {
  return (
    sessionStorage.getItem("systemID") ||
    sessionStorage.getItem("sysID")
  );
};

const getHeaders = () => {
  return {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };
};


/*
|--------------------------------------------------------------------------
| IMPORTANT
|--------------------------------------------------------------------------
| PasswordField is OUTSIDE the Password component.
|
| This fixes the problem where the cursor automatically leaves the
| password input after typing one character.
|--------------------------------------------------------------------------
*/

const PasswordField = ({
  label,
  name,
  value,
  visible,
  setVisible,
  placeholder,
  onChange,
}) => {
  return (
    <div className="password-field">

      <label htmlFor={name}>
        {label}
      </label>

      <div className="password-input-wrapper">

        <FiKey className="password-input-icon" />

        <input
          id={name}
          name={name}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="new-password"
        />

        <button
          type="button"
          className="password-eye"
          onClick={() =>
            setVisible((previous) => !previous)
          }
          aria-label={
            visible
              ? `Hide ${label}`
              : `Show ${label}`
          }
        >
          {visible ? (
            <FiEyeOff />
          ) : (
            <FiEye />
          )}
        </button>

      </div>

    </div>
  );
};


const Requirement = ({
  valid,
  text,
}) => {
  return (
    <div
      className={`password-requirement ${
        valid ? "valid" : ""
      }`}
    >
      {valid ? (
        <FiCheckCircle />
      ) : (
        <FiAlertCircle />
      )}

      <span>
        {text}
      </span>
    </div>
  );
};


const Password = ({
  onClose,
  onSuccess,
  onError,
}) => {

  const [passwordType, setPasswordType] =
    useState("master");

  const [password, setPassword] =
    useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  const [
    showCurrentPassword,
    setShowCurrentPassword,
  ] = useState(false);

  const [
    showNewPassword,
    setShowNewPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);


  /*
  |--------------------------------------------------------------------------
  | Password Change
  |--------------------------------------------------------------------------
  */

  const handlePasswordChange = (
    event
  ) => {

    const {
      name,
      value,
    } = event.target;

    setPassword(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };


  /*
  |--------------------------------------------------------------------------
  | Password Requirements
  |--------------------------------------------------------------------------
  */

  const passwordRequirements = {
    length:
      password.newPassword.length >= 8,

    uppercase:
      /[A-Z]/.test(
        password.newPassword
      ),

    lowercase:
      /[a-z]/.test(
        password.newPassword
      ),

    number:
      /\d/.test(
        password.newPassword
      ),

    special:
      /[^A-Za-z0-9]/.test(
        password.newPassword
      ),
  };


  const requirementCount =
    Object.values(
      passwordRequirements
    ).filter(Boolean).length;


  /*
  |--------------------------------------------------------------------------
  | Password Strength
  |--------------------------------------------------------------------------
  */

  const getStrength = () => {

    if (!password.newPassword) {
      return {
        label: "Enter a password",
        className: "empty",
      };
    }

    if (requirementCount <= 2) {
      return {
        label: "Weak",
        className: "weak",
      };
    }

    if (requirementCount <= 4) {
      return {
        label: "Medium",
        className: "medium",
      };
    }

    return {
      label: "Strong",
      className: "strong",
    };
  };


  const strength = getStrength();


  /*
  |--------------------------------------------------------------------------
  | Submit Password
  |--------------------------------------------------------------------------
  */

  const submitPassword = async (
    event
  ) => {

    event.preventDefault();

    const systemID = getSystemID();


    if (!systemID) {

      onError?.(
        "System ID was not found. Please login again."
      );

      return;
    }


    if (!password.currentPassword) {

      onError?.(
        "Please enter your current password."
      );

      return;
    }


    if (!password.newPassword) {

      onError?.(
        "Please enter a new password."
      );

      return;
    }


    if (
      !passwordRequirements.length
    ) {

      onError?.(
        "New password must contain at least 8 characters."
      );

      return;
    }


    if (
      !passwordRequirements.uppercase
    ) {

      onError?.(
        "New password must contain at least one uppercase letter."
      );

      return;
    }


    if (
      !passwordRequirements.lowercase
    ) {

      onError?.(
        "New password must contain at least one lowercase letter."
      );

      return;
    }


    if (
      !passwordRequirements.number
    ) {

      onError?.(
        "New password must contain at least one number."
      );

      return;
    }


    if (
      !passwordRequirements.special
    ) {

      onError?.(
        "New password must contain at least one special character."
      );

      return;
    }


    if (
      password.newPassword !==
      password.confirmPassword
    ) {

      onError?.(
        "New password and confirm password do not match."
      );

      return;
    }


    try {

      setLoading(true);


      const endpoint =
        passwordType === "master"
          ? `${API_URL}/settings/password`
          : `${API_URL}/settings/public-password`;


     const response = await axios.put(
  endpoint,
  {
    systemID,
    currentPassword: password.currentPassword,
    newPassword: password.newPassword,
    confirmPassword: password.confirmPassword,
  },
  getHeaders()
);


      if (
        response.data?.success
      ) {

        setPassword({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        onSuccess?.(
          response.data.message ||
            "Password changed successfully."
        );

      } else {

        onError?.(
          response.data?.message ||
            "Unable to change password."
        );

      }

    } catch (error) {

      onError?.(
        error.response?.data?.message ||
          "Unable to change password. Please try again."
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="password-modal-overlay">

      <div className="password-modal">

        {/* Close */}

        <button
          type="button"
          className="password-modal-close"
          onClick={onClose}
          aria-label="Close password dialog"
        >
          <FiX />
        </button>


        {/* Header */}

        <div className="password-modal-header">

          <div className="password-modal-icon">
            <FiShield />
          </div>

          <div>

            <h2>
              Change Password
            </h2>

            <p>
              Update your Tap2Enter
              account password.
            </p>

          </div>

        </div>


        {/* Password Type */}

        <div className="password-type-tabs">

          <button
            type="button"
            className={
              passwordType === "master"
                ? "active"
                : ""
            }
            onClick={() =>
              setPasswordType("master")
            }
          >
            Master Password
          </button>


          <button
            type="button"
            className={
              passwordType === "public"
                ? "active"
                : ""
            }
            onClick={() =>
              setPasswordType("public")
            }
          >
            Public Password
          </button>

        </div>


        {/* Form */}

        <form
          onSubmit={submitPassword}
        >

          <PasswordField
            label="Current Password"
            name="currentPassword"
            value={
              password.currentPassword
            }
            visible={
              showCurrentPassword
            }
            setVisible={
              setShowCurrentPassword
            }
            onChange={
              handlePasswordChange
            }
            placeholder="Enter current password"
          />


          <PasswordField
            label="New Password"
            name="newPassword"
            value={
              password.newPassword
            }
            visible={
              showNewPassword
            }
            setVisible={
              setShowNewPassword
            }
            onChange={
              handlePasswordChange
            }
            placeholder="Enter new password"
          />


          <PasswordField
            label="Confirm Password"
            name="confirmPassword"
            value={
              password.confirmPassword
            }
            visible={
              showConfirmPassword
            }
            setVisible={
              setShowConfirmPassword
            }
            onChange={
              handlePasswordChange
            }
            placeholder="Confirm new password"
          />


          {/* Strength */}

          <div className="password-strength">

            <div className="password-strength-header">

              <span>
                Password strength
              </span>

              <strong
                className={
                  strength.className
                }
              >
                {strength.label}
              </strong>

            </div>


            <div className="strength-bar">

              <span
                className={
                  strength.className
                }
                style={{
                  width: `${
                    (requirementCount /
                      5) *
                    100
                  }%`,
                }}
              />

            </div>

          </div>


          {/* Requirements */}

          <div className="password-requirements">

            <p>
              Password must contain:
            </p>

            <Requirement
              valid={
                passwordRequirements.length
              }
              text="At least 8 characters"
            />

            <Requirement
              valid={
                passwordRequirements.uppercase
              }
              text="One uppercase letter"
            />

            <Requirement
              valid={
                passwordRequirements.lowercase
              }
              text="One lowercase letter"
            />

            <Requirement
              valid={
                passwordRequirements.number
              }
              text="One number"
            />

            <Requirement
              valid={
                passwordRequirements.special
              }
              text="One special character"
            />

          </div>


          {/* Buttons */}

          <div className="password-form-actions">

            <button
              type="button"
              className="password-cancel-button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>


            <button
              type="submit"
              className="password-submit-button"
              disabled={loading}
            >
              {loading
                ? "Updating..."
                : "Update Password"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default Password;