import React from 'react';

export default class CartItem extends React.Component {
/**
THIS IS AN EXPRIMENT FILE. IT IS USED TO LEARN LIFECYCLE METHODS. IT IS NOT USED IN THE PROJECT. 
*/


//SPECIFYING THE PROP TYPES 
    static propTypes = {
        title: React.PropTypes.string.isRequired,
        price: React.PropTypes.number.isRequired,
        initialQty: React.PropTypes.number
    };

// If the props are not provided then use these props 
    static defaultProps = {
        title: 'Undefined Product',
        price: 100,
        initialQty: 0
    };
    // the initial state of the app 
    state = {
        qty: this.props.initialQty,
        total: 0
    };
    
    constructor(props) {
        super(props);
    }
    // The component will mount lifecycle method. Calculate the price 
    componentWillMount() {
        this.recalculateTotal();
    }
    // Increase the quantity of the item
    increaseQty() {
        this.setState({qty: this.state.qty + 1}, this.recalculateTotal);
    }
    //decrease the qty of item in car and set the state 
    decreaseQty() {
        let newQty = this.state.qty > 0 ? this.state.qty - 1 : 0;
        this.setState({qty: newQty}, this.recalculateTotal);
    }

    recalculateTotal() {
        this.setState({total: this.state.qty * this.props.price});
    }
    //render the cart
    render() {
        return (<article className="row large-4">
            <figure className="text-center">
                <p>
                    <img src={this.props.image}/>
                </p>
                <figcaption>
                    <h2>{this.props.title}</h2>
                </figcaption>
            </figure>
            <p className="large-4 column"><strong>Quantity: {this.state.qty}</strong></p>

            <p className="large-4 column">
                <button onClick={this.increaseQty.bind(this)} className="button success">+</button>
                <button onClick={this.decreaseQty.bind(this)} className="button alert">-</button>
            </p>

            <p className="large-4 column"><strong>Price per item:</strong> ${this.props.price}</p>

            <h3 className="large-12 column text-center">
                Total: ${this.state.total}
            </h3>

        </article>);
    }
}