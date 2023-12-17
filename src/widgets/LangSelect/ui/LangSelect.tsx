import { Select } from 'antd';
import { classNames } from '@/shared/lib/classNames/classNames';
import styles from './LabgSelect.module.scss';
import i18n from '@/shared/config/i18n';

const filterOption = (input: string, option?: { label: string; value: string }) => (option?.label ?? '')
  .toLowerCase()
  .includes(input.toLowerCase());

const onChange = (value: string) => {
  i18n.changeLanguage(value)
};


export const LangSelect = () => (
  <Select
    className={classNames(styles.select)}
    showSearch
    placeholder="LANGUAGE"
    optionFilterProp="children"
    onChange={onChange}
    filterOption={filterOption}
    options={[
      {
        value: 'ru',
        label: 'Русский',
      },
      {
        value: 'en',
        label: 'English',
      },
    ]}
  />
);

