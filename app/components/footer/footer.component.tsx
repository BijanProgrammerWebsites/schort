"use client";

import { ReactElement, useContext } from "react";

import { usePathname } from "next/navigation";

import { FaGithub } from "react-icons/fa";

import { AnimationContext } from "@/app/context/animation.context";
import { AnimationStatusModel } from "@/app/models/animation-status.model";

import PopAnimation from "@/app/animations/pop/pop.animation";
import TypewriterAnimation from "@/app/animations/typewriter/typewriter.animation";

import LinkComponent, {
  LinkComponentVariant,
} from "@/app/components/link/link.component";

import styles from "./footer.module.scss";

export default function FooterComponent(): ReactElement {
  const pathname = usePathname();
  const isInAuth = pathname === "/auth";

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
    <footer className={"page-bleed " + styles.footer}>
      <small className={styles.copyright}>
        <TypewriterAnimation
          shouldStart={isInAuth || animationStatus.footerCopyright}
          doneCallback={(): void => playNextAnimation("footerCopyright")}
        >
          Copyright &copy; 2023 BijanProgrammer.com
        </TypewriterAnimation>
      </small>

      <PopAnimation
        shouldStart={isInAuth || animationStatus.footerGithub}
        doneCallback={(): void => playNextAnimation("footerGithub")}
      >
        <LinkComponent
          href="https://github.com/BijanProgrammerWebsites/projects-schort/"
          variant={LinkComponentVariant.GHOST}
          isExternal={true}
        >
          <span className={styles.source}>
            <FaGithub />
            Source on GitHub
          </span>
        </LinkComponent>
      </PopAnimation>
    </footer>
  );
}
