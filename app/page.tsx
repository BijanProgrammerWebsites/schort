import { ReactElement } from "react";

import HeroComponent from "@/app/components/hero/hero.component";
import GeneratorComponent from "@/app/components/generator/generator.component";

import styles from "./page.module.scss";

export default function Home(): ReactElement {
  return (
    <div className={styles["home-page"]}>
      <HeroComponent />
      <GeneratorComponent />
    </div>
  );
}
