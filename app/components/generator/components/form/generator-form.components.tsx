import { FormEvent, ReactElement, useState } from "react";

import { Link } from "@prisma/client";

import ButtonComponent, {
  ButtonComponentVariant,
} from "@/app/components/button/button.component";

import { ErrorDto } from "@/app/dto/error.dto";

import { SnackbarIdEnum } from "@/app/enums/snackbar-id.enum";
import { SnackbarVariantEnum } from "@/app/enums/snackbar-variant.enum";

import { useApi } from "@/app/hooks/api.hook";
import { useSnackbar } from "@/app/hooks/snackbar.hook";

import formStyles from "@/app/styles/form.module.scss";
import styles from "./generator-form.module.scss";

export default function GeneratorFormComponents({
  addLinkToList,
}: {
  addLinkToList: (link: Link) => void;
}): ReactElement {
  const { fetchData } = useApi();
  const { addSnackbar } = useSnackbar();

  const [alias, setAlias] = useState<string>("");
  const [original, setOriginal] = useState<string>("");

  const formSubmitHandler = async (
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    const result = await fetchData<Link>("POST", "/api/link", {
      original,
      alias,
    });
    if (result instanceof ErrorDto) {
      return;
    }

    setAlias("");
    setOriginal("");

    addLinkToList(result);

    addSnackbar({
      id: SnackbarIdEnum.LINK_GENERATE_SUCCESS,
      variant: SnackbarVariantEnum.SUCCESS,
      message: "The link successfully generated.",
    });
  };

  return (
    <div className={styles["generator-form-component"]}>
      <div
        className={`${formStyles["form-container"]} ${styles["form-container"]}`}
      >
        <header>
          <h2>Let&apos;s Make it Happen!</h2>
        </header>

        <main>
          <form onSubmit={formSubmitHandler}>
            <div className={formStyles["fields-wrapper"]}>
              <label>
                <div className={formStyles.title}>Alias (Optional)</div>
                <div className={formStyles.field}>
                  <input
                    type="text"
                    name="alias"
                    minLength={3}
                    maxLength={32}
                    pattern="^[a-z0-9\-]{3,32}$"
                    value={alias}
                    onChange={(e): void => setAlias(e.target.value)}
                    data-show-border-vaildation={!!alias}
                  />
                </div>
              </label>

              <label>
                <div className={formStyles.title}>Link</div>
                <div className={formStyles.field}>
                  <input
                    type="url"
                    name="url"
                    required
                    value={original}
                    onChange={(e): void => setOriginal(e.target.value)}
                    data-show-border-vaildation={!!original}
                  />
                </div>
              </label>

              <ButtonComponent
                variant={ButtonComponentVariant.PRIMARY}
                type="submit"
              >
                Generate
              </ButtonComponent>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
