import { useLocation } from 'react-router-dom'

export const useQueryParams = (location) => { // ✏️ 커스텀훅은 use로 시작해야한다.
    // Location
    const queryParams = new URLSearchParams(location.search);
    return queryParams;
}

export const useGetPathName = () => {
    // Location
    const location = useLocation();
    return location.pathname
}

