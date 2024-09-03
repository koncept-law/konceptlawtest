import DropdownOption from "../common/fields/DropdownOption";

const FilterOption = (campaignEmailTemplates = [], accountId="") => {
    return campaignEmailTemplates?.map((item) => {
        if(item?.accountId === accountId)
            return { label: <DropdownOption title={item?.templateName} value={item} />, value: item?.templateName }
    }) || []
}

export default FilterOption;