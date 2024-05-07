import { FC } from "react";
import styles from "@/components/Header.module.scss";

const Header = (): JSX.Element => {
  return (
    <header className={styles.headerFixed}>
      <div className={styles.headerLimiter}>
        <h1>
          <a href="#">
            Healthy<span>Heart</span>
          </a>
        </h1>
        {/* <nav>
          <a href="#">Home</a>
          <a href="#">Blog</a>
          <a href="#">Pricing</a>
          <a href="#">About</a>
          <a href="#">Faq</a>
          <a href="#">Contact</a>
        </nav> */}
      </div>
    </header>
  );
};
export default Header;
