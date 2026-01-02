"use client";

import { ReactElement, useContext } from "react";

import { Luckiest_Guy } from "next/font/google";
import Image from "next/image";

import { useSession } from "next-auth/react";

import heroIllustration from "@/app/assets/illustrations/hero.svg";

import { AnimationContext } from "@/app/context/animation.context";
import { AnimationStatusModel } from "@/app/models/animation-status.model";

import FlasherAnimation from "@/app/animations/flasher/flasher.animation";
import PopAnimation from "@/app/animations/pop/pop.animation";
import PopcornAnimation from "@/app/animations/popcorn/popcorn.animation";
import TypewriterAnimation from "@/app/animations/typewriter/typewriter.animation";
import LinkComponent from "@/app/components/link/link.component";

import styles from "./hero.module.scss";

const luckiestGuy = Luckiest_Guy({ weight: "400", subsets: ["latin"] });

export default function HeroComponent(): ReactElement {
  const { status: authStatus } = useSession();

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

  return (
    <section className={styles["hero-component"]}>
      <div className={styles.text}>
        <h1>
          <div className={styles.subtitle}>
            <FlasherAnimation
              shouldStart={animationStatus.keepItShort}
              doneCallback={(): void => playNextAnimation("keepItShort")}
            >
              keep it short
            </FlasherAnimation>
          </div>
          <div className={`${styles.title} ${luckiestGuy.className}`}>
            <span className={styles["size-matters"]}>
              <PopcornAnimation
                shouldStart={animationStatus.sizeMatters}
                doneCallback={(): void => playNextAnimation("sizeMatters")}
              >
                size matters!
              </PopcornAnimation>
            </span>
          </div>
        </h1>

        <p className={styles.description}>
          <TypewriterAnimation
            shouldStart={animationStatus.description}
            doneCallback={(): void => playNextAnimation("description")}
          >
            We can help you generate a short link from any URL. Short links are
            easier to share in social medias and they are also more likely to be
            remembered.
          </TypewriterAnimation>
        </p>
      </div>

      {authStatus === "unauthenticated" && (
        <p className={styles["suggestion"]}>
          <strong>
            <FlasherAnimation
              separator="\n"
              shouldStart={animationStatus.butWait}
              doneCallback={(): void => playNextAnimation("butWait")}
            >
              But Wait!
            </FlasherAnimation>
          </strong>{" "}
          <TypewriterAnimation
            shouldStart={animationStatus.betterOption}
            doneCallback={(): void => playNextAnimation("betterOption")}
          >
            There is an even better option...
          </TypewriterAnimation>
          <br />
          <TypewriterAnimation
            shouldStart={animationStatus.suggestion}
            doneCallback={(): void => playNextAnimation("suggestion")}
          >
            Sign up and manage the links that you have generated. You can even
            edit them or remove them entirely. Otherwise you cannot see them
            after you refresh the page. You can still use and share them and
            they will work but there is no way to see or edit them.
          </TypewriterAnimation>{" "}
          <LinkComponent href="/auth">
            <TypewriterAnimation
              shouldStart={animationStatus.signUpForFree}
              doneCallback={(): void => playNextAnimation("signUpForFree")}
            >
              Sign up for FREE
            </TypewriterAnimation>
          </LinkComponent>
        </p>
      )}

      <PopAnimation
        className={styles.image}
        shouldStart={animationStatus.image}
        doneCallback={(): void => playNextAnimation("image")}
      >
        <Image
          src={heroIllustration}
          alt="an illustration of a mobile phone that has a lot of messages, contacts and ratings floating around it"
        />
      </PopAnimation>
    </section>
  );
}
