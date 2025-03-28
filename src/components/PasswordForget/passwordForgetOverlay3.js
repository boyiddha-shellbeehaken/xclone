import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./passwordForgetOverlay3.module.css";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { updatePasswordAPI } from "@/app/actions/authActions";

const PasswordForgetOverlay3 = ({ email, setPassword, setIsFinalOverlay }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [isVisible1, setIsVisible1] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  //const [isOverlayOpen, setIsOverlayOpened] = useState(false);
  const router = useRouter();
  const isActive =
    newPassword.trim().length > 0 && confirmPassword.trim().length > 0;

  const updatePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Password didn't match");
      return;
    }

    try {
      const data = await updatePasswordAPI({ email, newPassword }); // Use the refactored API function

      setPassword(newPassword); // If successful, update password state
      setIsFinalOverlay(true); // Show overlay
    } catch (error) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <div className={styles.titleRow}>
        <span>Choose a new password</span>
      </div>
      <div className={styles.titleRow2}>
        <p>
          Make sure your new password is 8 characters or more. Try including
          numbers, letters, and punctuation marks for a{" "}
          <span className={styles.strongPassword}>strong password</span>
        </p>
        <br />
      </div>

      <div className={styles.inputPassword1}>
        <div className={styles.passwordBtn}>
          <input
            type={isVisible1 ? "text" : "password"}
            name="newPassword"
            id="newPassword"
            placeholder="Enter new Password"
            value={newPassword}
            autoComplete="off"
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className={styles.eyeDiv}>
          {!isVisible1 && (
            <IoEye
              className={styles.eyeBtn}
              onClick={() => setIsVisible1(!isVisible1)}
            />
          )}
          {isVisible1 && (
            <IoEyeOff
              className={styles.eyeBtn}
              onClick={() => setIsVisible1(!isVisible1)}
            />
          )}
        </div>
      </div>

      <div className={styles.inputPassword2}>
        <div className={styles.passwordBtn}>
          <input
            type={isVisible2 ? "text" : "password"}
            name="confirmPassword"
            id="confirmPassword"
            placeholder="Confirm your Password"
            value={confirmPassword}
            autoComplete="off"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className={styles.eyeDiv}>
          {!isVisible2 && (
            <IoEye
              className={styles.eyeBtn}
              onClick={() => setIsVisible2(!isVisible2)}
            />
          )}
          {isVisible2 && (
            <IoEyeOff
              className={styles.eyeBtn}
              onClick={() => setIsVisible2(!isVisible2)}
            />
          )}
        </div>
      </div>
      {error && <h3 style={{ color: "red" }}>{error}</h3>}
      <div className={styles.button}>
        <div className={styles.changeBtnContainerDiv}>
          <div
            className={`${styles.changeBtnContainerFlex} ${
              isActive ? styles.active : ""
            }`}
            onClick={() => {
              if (isActive) {
                updatePassword();
              }
            }}
          >
            <span className={styles.changeButton}>Change password</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default PasswordForgetOverlay3;
