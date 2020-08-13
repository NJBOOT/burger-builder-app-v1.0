import React from "react";
import classes from "./BuildControls.module.css";
import formatPrice from "../../../helpers/price";
import BuildControl from "./BuildControl/BuildControl";

const controls = [
  { label: "Salad", type: "salad" },
  { label: "Bacon", type: "bacon" },
  { label: "Cheese", type: "cheese" },
  { label: "Meat", type: "meat" },
];

const BuildControls = props => {
  return (
    <div className={classes.BuildControls}>
      <p>
        Current Price: <strong>{formatPrice.format(props.totalPrice)}</strong>
      </p>
      {controls.map((control, i) => (
        <BuildControl
          ingredientLabel={control.label}
          key={control.type + i}
          handleAddIngredient={() => props.handleAddIngredient(control.type)}
          handleRemoveIngredient={() =>
            props.handleRemoveIngredient(control.type)
          }
          disabledInfo={props.disabledInfo[control.type]}
        />
      ))}
      <button
        className={classes.OrderButton}
        disabled={!props.purchasable}
        onClick={props.handleOrder}
      >
        ORDER NOW
      </button>
    </div>
  );
};

export default BuildControls;
