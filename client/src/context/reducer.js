export const userActionType = {
  SET_USER: "SET_USER",
  SET_RETURN_URL: "SET_RETURN_URL",
};

const reducer = (state, action) => {
  switch (action.type) {
    case userActionType.SET_USER:
      return {
        ...state,
        user: action.user,
      };
    case userActionType.SET_RETURN_URL:
      return {
        ...state,
        returnURL: action.returnURL,
      };
    default:
      return state;
  }
};

export default reducer;
