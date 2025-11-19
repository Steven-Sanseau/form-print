import { getTranslation } from "../i18n/index.js";

const operatorByActionType = {
  subtract: "-",
  add: "+",
  divide: "/",
  multiply: "x",
};

export default function actionDetailsText(actionType, details, fieldsByRef) {
  switch (actionType) {
    case "jump":
      {
        const { type, value } = details.to;
        switch (type) {
          case "thankyou":
            return getTranslation("logic.jumpToThankYou");
          case "field":
            return `${getTranslation("logic.jumpTo")} ${fieldsByRef[value].shortName}`;
        }
      }
      break;
    default: {
      const { target, value } = details;
      if (target.type !== "variable") {
        throw new Error(
          "Calculation not targeting a variable is not supported"
        );
      }
      const operator = operatorByActionType[actionType];
      const valuePrefix = value.type === "variable" ? "@" : "";
      return `@${target.value} ${operator} ${valuePrefix}${value.value}`;
    }
  }
}
