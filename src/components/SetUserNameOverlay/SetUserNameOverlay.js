"use client";

import styles from "./setUserNameOverlay.module.css";
import xLogo from "./../../../public/images/x_profile.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveUserNameAPI } from "@/app/actions/authActions";
import { doCredentialLogin } from "@/app/actions/logInOutActions";

const SetUserNameOverlay = ({ email, password, setIsOverlayOpen }) => {
  const [username, setUserName] = useState("");
  const [isNext, setIsNext] = useState(false);
  const router = useRouter();
  const handleNext = async () => {
    try {
      const saveResponse = await saveUserNameAPI({ email, username }); // Call the refactored API function

      const response = await doCredentialLogin(email, password);

      if (response.error) {
        console.error(response.error);
        setError(response.error.message);
      } else {
        setIsOverlayOpen(false);
        router.push("/home");
      }
    } catch (e) {
      console.error("Error during handleNext:", e.message);
      setError(e.message); // Handle error if needed
    }
  };

  return (
    <>
      <div className={styles.overlayContainer}>
        <div className={styles.overlayContent}>
          <div className={styles.row1ContainerDiv}>
            <div className={styles.row1ContainerFlex}>
              <div>
                <Image src={xLogo} alt="X Logo" width="30" height="30" />
              </div>
            </div>
          </div>
          <div className={styles.row2ContainerDiv}>
            <div className={styles.row2ContainerFlex}>
              <div>
                <h1>What should we call you?</h1>
              </div>
              <div className={styles.title}>
                <p>Your @username is unique. You can always change it later.</p>
              </div>
              <div className={styles.inputPassContainerDiv}>
                <div className={styles.inputVerification}>
                  <input
                    type="text"
                    name="verification"
                    id="verification"
                    placeholder="@Username"
                    value={username}
                    autoComplete="off"
                    onChange={(e) => setUserName(e.target.value)}
                    onClick={() => setIsNext(true)}
                  />
                </div>
              </div>

              <div className={styles.row4ContainerDiv}></div>
              <div className={styles.row5ContainerDiv}>
                <div
                  className={`${styles.row5ContainerFlex} ${
                    isNext ? styles.active : ""
                  }`}
                  onClick={handleNext}
                >
                  <span className={styles.nextButton}>Next</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SetUserNameOverlay;
