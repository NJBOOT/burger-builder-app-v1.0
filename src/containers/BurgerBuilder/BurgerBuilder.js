import React from "react";
import axios from "../../axiosOrders";
import Aux from "../../hoc/Aux/Aux";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7,
};

class BurgerBuilder extends React.Component {
  state = {
    ingredients: null,
    totalPrice: 0,
    purchasable: false,
    ordered: false,
    loading: false,
    error: false,
  };

  componentDidMount() {
    axios
      .get("https://burger-builder-7c82e.firebaseio.com/ingredients.json")
      .then(res => this.setState({ ingredients: res.data }))
      .catch(err => this.setState({ error: true }));
  }

  updatePurchasable = ingredients => {
    const sum = Object.values(ingredients).reduce((acc, el) => {
      return (acc += el);
    }, 0);
    this.setState({ purchasable: sum > 0 });
  };

  handleAddIngredient = type => {
    const oldCount = this.state.ingredients[type];
    const newCount = oldCount + 1;
    const updatedIngredients = {
      ...this.state.ingredients,
      [type]: newCount,
    };
    const updatedTotal = this.state.totalPrice + INGREDIENT_PRICES[type];

    this.setState({
      ingredients: updatedIngredients,
      totalPrice: updatedTotal,
    });
    this.updatePurchasable(updatedIngredients);
  };

  handleRemoveIngredient = type => {
    const oldCount = this.state.ingredients[type];
    if (oldCount <= 0) {
      return;
    }
    const newCount = oldCount - 1;
    const updatedIngredients = {
      ...this.state.ingredients,
      [type]: newCount,
    };
    const updatedTotal = this.state.totalPrice - INGREDIENT_PRICES[type];

    this.setState({
      ingredients: updatedIngredients,
      totalPrice: updatedTotal,
    });
    this.updatePurchasable(updatedIngredients);
  };

  handleOrder = () => {
    this.setState({ ordered: true });
  };

  handleClearOrder = () => {
    const ingredients = { ...this.state.ingredients };
    const cleared = Object.keys(ingredients)
      .map(el => {
        return { [el]: 0 };
      })
      .reduce((arr, el) => {
        return (arr = { ...arr, ...el });
      }, {});
    this.setState({ ingredients: cleared, totalPrice: 0, purchasable: false });
  };

  modalClose = () => {
    this.setState({ ordered: false });
  };

  handleContinuePurchase = () => {
    this.setState({ loading: true });
    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice,
      customer: {
        name: "Nico",
        address: {
          street: "700 Johnson Road",
          zipCode: 475678,
          country: "United States",
        },
        email: "test@test.com",
      },
      deliveryMethod: "fastest",
    };
    axios
      .post("/orders.json", order)
      .then(res => {
        this.setState({ loading: false, ordered: false });
        this.handleClearOrder();
      })
      .catch(err => {
        console.log(err);
        this.setState({ loading: false, ordered: false });
      });
  };

  render() {
    const disabledInfo = { ...this.state.ingredients };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }
    let orderSummary = null;
    let burger = this.state.error ? (
      <p>Ingredients can't be loaded...</p>
    ) : (
      <Spinner />
    );
    if (this.state.ingredients) {
      burger = (
        <Aux>
          <Burger ingredients={this.state.ingredients} />
          <BuildControls
            handleAddIngredient={this.handleAddIngredient}
            handleRemoveIngredient={this.handleRemoveIngredient}
            disabledInfo={disabledInfo}
            totalPrice={this.state.totalPrice}
            purchasable={this.state.purchasable}
            handleOrder={this.handleOrder}
            handleClearOrder={this.handleClearOrder}
          />
        </Aux>
      );
      orderSummary = (
        <OrderSummary
          handleCancelPurchase={this.modalClose}
          handleContinuePurchase={this.handleContinuePurchase}
          ingredients={this.state.ingredients}
          totalPrice={this.state.totalPrice}
        />
      );
    }
    if (this.state.loading) {
      orderSummary = <Spinner />;
    }
    return (
      <Aux>
        <Modal visible={this.state.ordered} modalClose={this.modalClose}>
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

export default withErrorHandler(BurgerBuilder, axios);
