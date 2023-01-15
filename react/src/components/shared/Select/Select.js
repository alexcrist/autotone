import styles from './Select.css';

export const Select = ({ options, value, setValue }) => {
  
  const onChange = (event) => setValue(event.target.value);
  
  return (
    <select 
      className={styles.select}
      value={value} 
      onChange={onChange}
    >
      {options.map((value, index) => (
        <option 
          value={value} 
          key={index}
        >
          {value}
        </option>
      ))}
    </select>
  );
};
