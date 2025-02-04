import React from 'react';
import CreatableSelect from 'react-select/creatable';


const valuesFor = tags => tags.map(t => ({value: t, label: t}))

export default function({tags, onChange}) {
  function handleChange(e) {
    console.log({e});
    const items = e.map(i => i.value);
    console.log({items})
    onChange(items)
  }

  return <CreatableSelect onChange={handleChange} isMulti defaultValue={valuesFor(tags)} isClearable placeholder="select tags..."/>;
}
