import React from 'react'
import { IoSearch } from 'react-icons/io5';

const SearchValues = ({ data = [] , searchKeys = [] }) => {

    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const handleInputChange = (event) => {
        setSearchInput(event.target.value);
    };

    const handleSearch = () => {
        setSearchQuery(searchInput);
    };

    const filteredData = data?.filter(item => {
        return (
            // item.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            // item.lastName.toLowerCase().includes(searchQuery.toLowerCase())
            searchKeys?.map((value , index)=>{
                if (!searchKeys || searchKeys.length === 0) {
                    return [];
                }
                
                if(searchKeys.length === 1 ){
                    // return item[value.toLowerCase()].includes(searchQuery.toLowerCase())
                    return item.value.toLowerCase().includes(searchQuery.toLowerCase()).join("||")
                } 
                // if(searchKeys.length > 1){
                //         return item[value.toLowerCase()].includes(searchQuery.toLowerCase()) && item[searchKeys[index + 1]]
                // }
            })
            // ||
            // item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            // item.id.toString().includes(searchQuery)
        );
    });

    return (
        <div className='bg-gray-200 flex gap-x-4 p-2 my-2 rounded-md h-[60px]'>
            <input
                type="text"
                className="border-2 rounded p-1 flex-1 focus:ring-2 focus:ring-purple-800 outline-none"
                placeholder="Search Now"
                onChange={handleInputChange}
            />
            <button
                type="submit"
                className=" flex items-center gap-1 buttonBackground px-2 py-1 rounded-md text-white font-semibold"
                onClick={() => handleSearch()}
            >
                <IoSearch size={26} /> Search
            </button>
        </div>
    )
}

export default SearchValues
