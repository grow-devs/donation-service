import { Tabs, Tab,Box} from "@mui/material";

export default function CategoryTabs({ categories, selected, onChange }) {
  return (
    <Tabs
      value={selected}
      onChange={(e, newValue) => onChange(newValue)}
      variant="scrollable"
      scrollButtons="auto"
      sx={{
        mb: 2,
        display: "flex",
        justifyContent: "center",
      }}
    >
      {categories.map((cat) => (
        <Tab
          key={cat.id}
          label={cat.name}
          value={cat.id}
          icon={
            <Box
              component="img"
              src={cat.icon}
              alt={cat.name}
              sx={{ width: 32, height: 32 }}
            />
          }
          iconPosition="top"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      ))}
    </Tabs>
  );
}
