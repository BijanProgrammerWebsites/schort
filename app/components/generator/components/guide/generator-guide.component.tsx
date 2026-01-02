import { ReactElement } from "react";

import styles from "./generator-guide.module.scss";

export default function GeneratorGuideComponent(): ReactElement {
  return (
    <div className={styles["generator-guide-component"]}>
      <header>
        <h2>How Does This Work?</h2>
      </header>

      <main>
        <p>
          Alias is a unique name that we will use to identify your link with.
          For example if alias is <em>something</em>, then generated link will
          be{" "}
          <em>
            {new URL("/something", process.env.NEXT_PUBLIC_HOST).toString()}
          </em>
          .
        </p>
        <p>
          You can use lowercase letters (a-z), digits (0-9) and hyphens (-) for
          alias. Also it has to contain 3 to 32 characters.
        </p>
        <p>
          Filling out alias input is optional. If you choose to leave it blank,
          we will create one for you.
        </p>
        <p>
          Original URL has to be valid, So if a user clicks on the short link
          that was generated for you, we will redirect them to that URL.
        </p>
      </main>
    </div>
  );
}
