import React, { useEffect, useState } from 'react'
import { useGetPathName } from '../../commonFunc/url'
import { useNavigate } from 'react-router-dom';

const Search = React.memo(({ keyword, setKeyword, setCurrentPage, placeHolder }) => {
    let path = useGetPathName();

    // State
    const [searchInput, setSearchInput] = useState('')

    // navigate
    const navigate = useNavigate();

    // Method
    const onChangeSearchInput = (e) => {
        setSearchInput(e.target.value)
    }
    const onSubmitSearch = (e) => {
        e.preventDefault();

        let keyword = searchInput;
        keyword = keyword.trim()

        if (keyword && keyword.length < 2) {
            alert('검색어를 두 글자 이상 입력하세요.')
            return false;
        }

        setKeyword(keyword)
        setCurrentPage(1)
        navigate(`${path}?keyword=${keyword}`)
    }

    useEffect(() => {
        keyword == '' ? setSearchInput('') : setSearchInput(keyword)
    }, [keyword])

    return (
        <>
            <form className="d-inline-flex" onSubmit={onSubmitSearch}>
                <input className="form-control me-2" placeholder={placeHolder ? placeHolder : '검색어를 입력해주세요.'} aria-label="Search" value={searchInput} onChange={onChangeSearchInput} />
                <button className="btn btn-secondary">Search</button>
            </form>
        </>
    )
})

export default Search