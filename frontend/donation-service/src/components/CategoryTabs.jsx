import { Tabs, Tab } from '@mui/material';

export default function CategoryTabs({ categories, selected, onChange }) {
  return (
    <Tabs
      value={selected}
      onChange={(e, newValue) => onChange(newValue)}
      variant="scrollable"
      scrollButtons="auto"
      sx={{ mb: 2 ,display: 'flex', justifyContent: 'center'}}
    >
      {categories.map((cat) => (
        <Tab key={cat.id} label={cat.name} value={cat.id} />
      ))}
    </Tabs>
  );
}
