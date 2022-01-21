export const isHttpOrHttpsUrl = (url: string) => {
  const regRule = /(http|https):\/\/([\w.]+\/?)\S*/;

  return regRule.test(url.toLowerCase());
};
