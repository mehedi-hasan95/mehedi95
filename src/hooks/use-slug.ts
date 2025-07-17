export const useInsideLink = (url: string) => {
  return (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(url, "_blank");
  };
};
