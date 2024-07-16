import { configureStore } from '@reduxjs/toolkit'
import memberSliceReducer from '../features/member/memberSlice'
// '../features/member/memberSlice'파일에서 export default로 내보낸 값이 memberSliceReducer에 담기게된다.

// Redux Persist
import {
    persistStore,
    persistReducer,
    // FLUSH,
    // REHYDRATE,
    // PAUSE,
    // PERSIST,
    // PURGE,
    // REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // 기본 로컬 스토리지 사용

// persist 설정
const persistConfig = {
    key: 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig, memberSliceReducer);

const store = configureStore({
    reducer: {
        member: persistedReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            // serializableCheck: {
                // ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            // },
        }),
})

export const persistor = persistStore(store);
export default store;


// // Redux Persist 사용전
// export default configureStore({
//     reducer: {
//         member: memberSliceReducer
//     }
// })