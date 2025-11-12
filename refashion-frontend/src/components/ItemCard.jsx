const ItemCard = ({ item }) => {
  // Support both old format (image_url) and new format (images array)
  const imageUrl = item.image_url || (item.images && item.images[0]);
  const { title, brand, condition, category, price, description } = item;

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-brand-light text-brand-dark">
            <span className="text-sm font-medium">No Image</span>
          </div>
        )}
        {price && (
          <div className="absolute bottom-2 right-2 rounded-full bg-brand px-3 py-1 text-sm font-bold text-white shadow-lg">
            ${parseFloat(price).toFixed(2)}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col space-y-2 p-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="line-clamp-2 text-sm text-gray-600">{description}</p>
        )}
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
          {brand && <span className="rounded-full bg-gray-100 px-2 py-1">{brand}</span>}
          {condition && (
            <span className="rounded-full bg-gray-100 px-2 py-1 capitalize">{condition}</span>
          )}
          {category && (
            <span className="rounded-full bg-gray-100 px-2 py-1 capitalize">{category}</span>
          )}
        </div>
      </div>
    </article>
  );
};

export default ItemCard;

