export const topology = {
  groups: [
    {
      id: "laptops",
      label: "Laptops",
      children: [
        {
          id: "lap1",
          label: "Laptop-01"
        },
        {
          id: "lap2",
          label: "Laptop-02"
        }
      ]
    },

    {
      id: "servers",
      label: "Servers",
      children: [
        {
          id: "srv1",
          label: "Web Server"
        }
      ]
    }
  ]
};