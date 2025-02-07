import React from 'react';
import CreatableSelect from 'react-select/creatable';


const valuesFor = tags => tags.map(t => ({value: t, label: t}))

export default function({tags, onChange}) {
  function handleChange(e) {
    onChange(e.map(i => i.value))
  }

  return <CreatableSelect onChange={handleChange} isMulti defaultValue={valuesFor(tags)} isClearable placeholder="select tags..."/>;
}
