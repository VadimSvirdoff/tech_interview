import { useEffect, useState } from "react";
import dataSource from "../dataSource.json";

const Search = () => {
  const [data, setData] = useState<Model[] | null>();
  const [selectedData, setSelectedData] = useState<Model[] | null>();

  // Initialization dataSource to localStorage
  // Getting data from local storage
  useEffect(() => {
    // localStorage.clear();
    const data = localStorage.getItem("data");
    if (!data) {
      localStorage.setItem("data", JSON.stringify(dataSource));
      setData(dataSource);
    } else {
      const parsedData = JSON.parse(data);
      setData(parsedData);
    }
  }, []);

  // Filitering initial data using type/name property in Model
  const filterData = (
    field: FilterDataType,
    data: Model[],
    inputValue: string
  ) => {
    return data.filter((element) =>
      inputValue.toLowerCase().includes(element.i[field].toLowerCase())
    );
  };

  // Initialazing and updating cache
  const setCache = (value: string, data: Model[]): void => {
    const cache = localStorage.getItem("cache");
    let newCache: CacheData;
    if (cache) {
      const parsedCache = JSON.parse(cache) as CacheData;
      newCache = [...parsedCache, { value, data }];
      localStorage.setItem("cache", JSON.stringify(newCache));
    } else {
      newCache = [{ value, data }];
      localStorage.setItem("cache", JSON.stringify(newCache));
    }
  };

  // Getting data from cache using value in name input
  const getDataFromCache = (value: string): Model[] | null => {
    const cache = localStorage.getItem("cache");
    if (cache) {
      const parsedCache = JSON.parse(cache) as CacheData;
      const dataInCache = parsedCache.find((cacheElememnt) =>
        cacheElememnt.value.includes(value)
      );
      if (dataInCache) {
        return dataInCache.data;
      }
    }
    return null;
  };

  // Filtering/Validating data
  // Getting/Updating cache in localStorage
  // check field name type/name
  // check is value in cache
  // if value in cache take and return data
  // else add value with data to cache and return data
  const handleNameField = (value: string) => {
    if (value.length > 1 && data) {
      const isType = ["private", "offchain", "onchain"].includes(
        value.toLowerCase()
      );

      const cachedData = getDataFromCache(value);
      if (!cachedData) {
        let filtredData;

        if (isType) {
          filtredData = filterData("type", data, value);
        } else {
          filtredData = filterData("name", data, value);
        }

        setCache(value, filtredData);
        setSelectedData(filtredData);
      } else {
        setSelectedData(cachedData);
      }
    }
  };
  console.log(localStorage.getItem("cache"));
  return (
    <>
      <h1>Search</h1>
      <input
        onChange={(e) => {
          handleNameField(e.target.value);
        }}
      />
    </>
  );
};

export default Search;
