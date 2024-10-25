import { useSelector } from "react-redux";
import ABILITY from "../config/ability";
import handleName from "../constants/handleName";
import { useMemo } from "react";

const useAbility = () => {
    const { singleUser } = useSelector(state => state.campaigns);
    let userName = handleName(singleUser);

    const abilities = useMemo(() => {
        return ABILITY[userName];
    }, [singleUser]);

    /**
     * @param {'read' | 'write' | 'delete' | 'data'} type 
     * @param value - value according to type
     */
    const can = (type = "", value = "") => {
        try {
            let ability = abilities[type];
            if (ability) {
                if (type === "data") {
                    return ability[value];
                } else {
                    return ability.includes(value);
                }
            } else {
                console.error(`useAbility: Error '${type}' ability not found!`);
                return false; // Return false instead of throwing an error to avoid a blank page
            }
        } catch (error) {
            console.error(`useAbility: Error processing '${type}' ability - ${error.message}`);
            return false; // Return false if an unexpected error occurs
        }
    }

    /**
     * @param {'read' | 'write' | 'delete'} type 
     * @param value - filter value according to type and return boolean value true | false.
     */
    const cannot = (type = "", value = "") => {
        try {
            let ability = abilities[type];
            if (ability) {
                return !ability.includes(value);
            } else {
                console.error(`useAbility: Error '${type}' ability not found!`);
                return false; // Return false instead of throwing an error to avoid a blank page
            }
        } catch (error) {
            console.error(`useAbility: Error processing '${type}' ability - ${error.message}`);
            return false; // Return false if an unexpected error occurs
        }
    }

    return {
        abilities,
        can,
        cannot,
    }
}

export default useAbility;