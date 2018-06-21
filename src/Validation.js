import React, { Component } from 'react';
import { bool, func, shape } from 'prop-types';
import { withFormContext } from './FormContext';

class Validation extends Component {
    static defaultProps = {
        errors: {},
        fields: {},
        initialValues: {},
    };

    static propTypes = {
        config: shape({}).isRequired,
        errors: shape({}),
        fields: shape({}),
        register: func,
        submitted: bool,
        unregister: func,
    };

    getFields = source => {
        const { config } = this.props;
        const getFirstDefinedValue = (...values) =>
            values.find(value => value !== undefined);
        return Object.keys(config).reduce(
            (allFields, field) => ({
                ...allFields,
                [field]: getFirstDefinedValue(source[field], ''),
            }),
            {},
        );
    };

    componentDidMount() {
        const { register, initialValues, config } = this.props;
        register(config, this.getFields(initialValues));
    }
    componentWillUnmount() {
        this.props.unregister(this.props.config);
    }
    render() {
        const {
            errors,
            fields,
            submitted,
            children,
            config,
            setField,
        } = this.props;

        const childrenArgs = {
            errors,
            fields: this.getFields(fields),
            submitted,
            setField,
        };

        return children(childrenArgs);
    }
}

export default withFormContext(Validation);
