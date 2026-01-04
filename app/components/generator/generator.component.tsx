"use client";

import { ReactElement, useContext, useEffect, useState } from "react";

import { useSession } from "next-auth/react";

import Loading from "@/app/loading";

import { AnimationContext } from "@/app/context/animation.context";
import { AnimationStatusModel } from "@/app/models/animation-status.model";

import PopAnimation from "@/app/animations/pop/pop.animation";

import GeneratorFormComponents from "./components/form/generator-form.components";
import GeneratorGuideComponent from "@/app/components/generator/components/guide/generator-guide.component";
import GeneratorListComponent from "@/app/components/generator/components/list/generator-list.component";

import styles from "./generator.module.scss";
import { Link } from "@/db/schema";

export default function GeneratorComponent(): ReactElement {
  const { status: authStatus } = useSession();

  const [serverLinks, setServerLinks] = useState<Link[]>([]);
  const [clientLinks, setClientLinks] = useState<Link[]>([]);

  const { animationStatus, dispatch: animationDispatch } =
    useContext(AnimationContext);

  const playNextAnimation = (
    currentAnimation: keyof AnimationStatusModel,
  ): void => {
    animationDispatch({
      type: "START_NEXT_ANIMATION",
      payload: { currentAnimation },
    });
  };

  const fetchServerLinks = async (): Promise<void> => {
    const response = await fetch("/api/link");
    const data: Link[] = await response.json();

    setServerLinks(data);
  };

  useEffect(() => {
    if (authStatus === "authenticated") {
      fetchServerLinks().then();
    }
  }, [authStatus]);

  const addLinkToList = (addedLink: Link): void => {
    if (authStatus === "authenticated") {
      setServerLinks((previousValue) => [addedLink, ...previousValue]);
    } else {
      setClientLinks((previousValue) => [addedLink, ...previousValue]);
    }
  };

  return (
    <section className={styles["generator-component"]}>
      <div className={styles.form}>
        <PopAnimation
          shouldStart={animationStatus.generatorForm}
          doneCallback={(): void => playNextAnimation("generatorForm")}
        >
          <GeneratorFormComponents addLinkToList={addLinkToList} />
        </PopAnimation>
      </div>

      <div className={styles.guide}>
        <PopAnimation
          shouldStart={animationStatus.generatorGuide}
          doneCallback={(): void => playNextAnimation("generatorGuide")}
        >
          <GeneratorGuideComponent />
        </PopAnimation>
      </div>

      <div className={styles.list}>
        {authStatus === "loading" ? (
          <Loading />
        ) : authStatus === "authenticated" ? (
          <GeneratorListComponent
            links={serverLinks}
            setLinks={setServerLinks}
            isEditable={true}
          />
        ) : (
          <GeneratorListComponent
            links={clientLinks}
            setLinks={setClientLinks}
            isEditable={false}
          />
        )}
      </div>
    </section>
  );
}
