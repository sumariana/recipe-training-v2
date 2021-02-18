export const getNextPage = (nextPage) => {
    if (nextPage === null) {
        return null;
    }
    const splitted = nextPage.split("=");
    return splitted[1] ? splitted[1] : null
}