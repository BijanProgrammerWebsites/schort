import { AnimationStatusModel } from "@/app/models/animation-status.model";

interface AnimationState {
  animationStatus: AnimationStatusModel;
}

export type AnimationAction = {
  type: "START_NEXT_ANIMATION";
  payload: {
    currentAnimation: keyof AnimationStatusModel;
  };
};

const nextAnimation: Record<
  keyof AnimationStatusModel,
  (keyof AnimationStatusModel)[]
> = {
  sizeMatters: ["keepItShort"],
  keepItShort: [
    "description",
    "headerLogo",
    "headerAuth",
    "footerCopyright",
    "footerGithub",
    "generatorForm",
    "generatorGuide",
    "generatorListItem",
  ],
  description: ["image"],
  image: ["butWait"],
  butWait: ["betterOption"],
  betterOption: ["suggestion"],
  suggestion: ["signUpForFree"],
  signUpForFree: [],
  headerLogo: [],
  headerAuth: [],
  footerCopyright: [],
  footerGithub: [],
  generatorForm: [],
  generatorGuide: [],
  generatorListItem: [],
  authForm: [],
};

export default function animationReducer(
  currentState: AnimationState,
  action: AnimationAction,
): AnimationState {
  switch (action.type) {
    case "START_NEXT_ANIMATION": {
      const status = { ...currentState.animationStatus };

      const nextAnimations = nextAnimation[action.payload.currentAnimation];
      nextAnimations.forEach((animation) => (status[animation] = true));

      return { animationStatus: status };
    }
    default:
      throw new Error("Unknown action type");
  }
}
