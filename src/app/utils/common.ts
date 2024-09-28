export const onSearchChange = (event: Event | string, avalaibleContent: any[], content: any[], selectedItems: any[], showItems: boolean) => {
  const search = typeof event === 'string' ? event : (event.target as HTMLInputElement).value.trim();
  if (search.length > 0) {
    avalaibleContent = content.filter(item => {
      let itemSearch: string;
      if(item.name){
        itemSearch = item.name;
      }else if(item.full_name){
        itemSearch = item.full_name;
      }else{
        itemSearch = item.attributes.title;
      }
      const itemId = item.id || item.person_id;
      return itemSearch.toLowerCase().includes(search.toLowerCase()) &&
      !selectedItems.some(selectedItem => {
        const selectedItemId = selectedItem.id || selectedItem.person_id;
        return selectedItemId === itemId;
      });
    });
    showItems = avalaibleContent.length > 0;
  } else {
    avalaibleContent = content.filter(item => {
      const itemId = item.id || item.person_id;
      return !selectedItems.some(selectedItem => {
        const selectedItemId = selectedItem.id || selectedItem.person_id;
        return selectedItemId === itemId;
      });
    });
    showItems = avalaibleContent.length > 0;
  }

  return {avalaibleContent, selectedItems, showItems};
}
