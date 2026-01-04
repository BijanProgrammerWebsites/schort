import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  ReactElement,
  SetStateAction,
  useContext,
  useState,
} from "react";

import { AnimationContext } from "@/app/context/animation.context";
import { AnimationStatusModel } from "@/app/models/animation-status.model";

import FadeAnimation from "@/app/animations/fade/fade.animation";

import ButtonComponent, {
  ButtonComponentSize,
  ButtonComponentVariant,
} from "@/app/components/button/button.component";
import LinkComponent from "@/app/components/link/link.component";

import { ErrorDto } from "@/app/dto/error.dto";

import { SnackbarIdEnum } from "@/app/enums/snackbar-id.enum";
import { SnackbarVariantEnum } from "@/app/enums/snackbar-variant.enum";

import { useApi } from "@/app/hooks/api.hook";
import { useSnackbar } from "@/app/hooks/snackbar.hook";

import formStyles from "@/app/styles/form.module.scss";
import styles from "./generator-list.module.scss";
import { Link } from "@/db/schema";

export default function GeneratorListComponent({
  links,
  setLinks,
  isEditable,
}: {
  links: Link[];
  setLinks: Dispatch<SetStateAction<Link[]>>;
  isEditable: boolean;
}): ReactElement {
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
    <ul className={styles["generator-list-component"]}>
      {links.map((link) => (
        <FadeAnimation
          key={link.id}
          shouldStart={animationStatus.generatorListItem}
          waitUntilComeIntoView={true}
          doneCallback={(): void => playNextAnimation("generatorListItem")}
        >
          <li>
            <GeneratorListItemComponent
              link={link}
              setLinks={setLinks}
              isEditable={isEditable}
            />
          </li>
        </FadeAnimation>
      ))}
    </ul>
  );
}

function GeneratorListItemComponent({
  link,
  setLinks,
  isEditable,
}: {
  link: Link;
  setLinks: Dispatch<SetStateAction<Link[]>>;
  isEditable: boolean;
}): ReactElement {
  const { fetchData } = useApi();
  const { addSnackbar } = useSnackbar();

  const [alias, setAlias] = useState<string>(link.alias);
  const [isConfirmButtonDisabled, setIsConfirmButtonDisabled] =
    useState<boolean>(true);

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    setAlias(e.target.value);
    setIsConfirmButtonDisabled(false);
  };

  const formSubmitHandler = async (
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    const result = await fetchData<Link>("PUT", "/api/link", {
      id: link.id,
      alias,
    });
    if (result instanceof ErrorDto) {
      return;
    }

    setIsConfirmButtonDisabled(true);

    setLinks((previousValue) =>
      previousValue.map((x) => (x.id === link.id ? result : x)),
    );

    addSnackbar({
      id: SnackbarIdEnum.LINK_UPDATE_SUCCESS,
      variant: SnackbarVariantEnum.SUCCESS,
      message: "The link successfully updated.",
    });
  };

  const copyButtonClickHandler = async (): Promise<void> => {
    try {
      const content = new URL(
        link.alias,
        process.env.NEXT_PUBLIC_HOST,
      ).toString();

      if ("clipboard" in navigator) {
        await navigator.clipboard.writeText(content);
      } else {
        document.execCommand("copy", true, content);
      }

      addSnackbar({
        id: SnackbarIdEnum.LINK_COPY_SUCCESS,
        variant: SnackbarVariantEnum.SUCCESS,
        message: "The link successfully copied to your clipboard.",
      });
    } catch {
      addSnackbar({
        id: SnackbarIdEnum.LINK_COPY_FAIL,
        variant: SnackbarVariantEnum.DANGER,
        message: "Your browser does not support this feature.",
      });
    }
  };

  const removeButtonClickHandler = async (): Promise<void> => {
    const result = await fetchData<void>("DELETE", "/api/link", {
      id: link.id,
    });
    if (result instanceof ErrorDto) {
      return;
    }

    setLinks((previousValue) => previousValue.filter((x) => x.id !== link.id));

    addSnackbar({
      id: SnackbarIdEnum.LINK_REMOVE_SUCCESS,
      variant: SnackbarVariantEnum.SUCCESS,
      message: "The link successfully removed.",
    });
  };

  return (
    <>
      <form onSubmit={(e): Promise<void> => formSubmitHandler(e)}>
        <div className={`${formStyles.field} ${styles.field}`}>
          <input
            type="text"
            name="alias"
            readOnly={!isEditable}
            minLength={3}
            maxLength={32}
            pattern="^[a-z0-9\-]{3,32}$"
            required
            value={alias}
            onChange={inputChangeHandler}
            data-show-border-vaildation={alias !== link.alias}
          />
        </div>

        <div className={styles.buttons}>
          {isEditable && (
            <ButtonComponent
              title="Confirm"
              variant={ButtonComponentVariant.SUCCESS}
              size={ButtonComponentSize.INHERIT}
              type="submit"
              disabled={isConfirmButtonDisabled}
            >
              Confirm
            </ButtonComponent>
          )}

          <ButtonComponent
            title="Copy"
            variant={ButtonComponentVariant.PRIMARY}
            size={ButtonComponentSize.INHERIT}
            onClick={(): Promise<void> => copyButtonClickHandler()}
          >
            Copy
          </ButtonComponent>

          {isEditable && (
            <ButtonComponent
              title="Remove"
              variant={ButtonComponentVariant.DANGER}
              size={ButtonComponentSize.INHERIT}
              onClick={(): Promise<void> => removeButtonClickHandler()}
            >
              Remove
            </ButtonComponent>
          )}
        </div>
      </form>

      <div className={styles.original}>
        <LinkComponent href={link.original} isExternal={true}>
          {link.original}
        </LinkComponent>
      </div>
    </>
  );
}
