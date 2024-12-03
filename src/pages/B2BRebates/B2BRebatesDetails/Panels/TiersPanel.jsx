import { useEffect, useState } from "react";
import Button from "../../../../components/shared/Button/Button";
import Buttons from "../../../../components/shared/Form/Buttons/Buttons";
import { InputInput } from "../../../../components/shared/Form/FormInputs/FormInputs";
import NoteBox from "../../../../components/shared/NoteBox/NoteBox";
import { updateStateKey } from "../../../../helpers/data";
import { withPreventDefault } from "../../../../helpers/functions";

/**
 * Choose rebate rate for each tier.
 *
 * @return {JSX.Element}
 * @constructor
 */
const TiersPanel = ({ rebate, tiers, onUpdate }) => {
    const [values, setValues] = useState({});

    // Initial values
    useEffect(() => {
        const initialValues = {};

        for (const tier of tiers) {
            initialValues[tier.id] = (rebate.tiers ?? []).find((t) => +t.id === +tier.id)?.amount ?? 0;
        }
        setValues(initialValues);
    }, []);

    // Submit the form
    const onSubmit = () => {
        /*const tiers = [...rebate.tiers];

         // Update the values
        
        for (const tier of tiers) {
            tier.amount = 1 * (values[tier.id] ?? 0);
        }
        onUpdate(tiers);*/

        const ret = [];
        Object.entries(values).map((value) => {
            ret.push({ id: value[0], amount: value[1] });
        });

        onUpdate(ret);
    };

    return (
        <form onSubmit={withPreventDefault(onSubmit)}>
            {/* The list of available items */}
            {tiers.map((tier) => (
                <InputInput type="number" key={tier.id} label={tier.name} value={values[tier.id] ?? ""} onChange={(event) => updateStateKey(setValues, tier.id, event.target.value)} />
            ))}

            {/* There are no available to show */}
            {tiers.length === 0 && <NoteBox message="Nema rabatnih skala za prikaz" className="mt" />}

            <Buttons>
                <Button type="submit" label="Sačuvaj" variant="contained" />
            </Buttons>
        </form>
    );
};

export default TiersPanel;
