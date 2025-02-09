// Project imports
import { getImageUrl, ImagePath } from '../utils/getImageUrl';
const GetAvatar = (name) => {
  const photo_new = `${name}.png`;
  return <img src={getImageUrl(`${photo_new}`, ImagePath.WIDGET)} alt="" className="img-20" />;
};

import { useNavigate } from 'react-router-dom'; // Using React Router for navigation

// Product table data
const ProductData = {
  wrapclass: 'table-card feed-card',
  height: '255px',
  title: 'All Dispute Raised',
  tableheading: ['Dispute ID', 'Category', 'Status', 'Amount', 'Action'],
  rowdata: [
    {
      name: 'DP456789234510',
      image: 'Non-receipt of goods',
      price: '$10,000.00',
      status: {
        badge: 'light-warning',
        label: 'Pending',
      },
      action: [
        {
          icon: 'eye',
          textcls: 'View Details',
          // Use relative URL or route
          link: '/Disputedetails', // Replace with the correct route for your case details page
        },
      ],
    },
    {
      name: 'DP456789234512',
      image: 'Non-receipt of goods',
      status: {
        badge: 'light-success',
        label: 'Payment Refund'
      },
      price: '$10',
      action: [
        {
          icon: 'eye',
          textcls: 'View Details',
          // Use relative URL or route
          link: '/Disputedetails', // Replace with the correct route for your case details page
        },
      ],
    },
    {
      name: 'DP456789234513',
      image: 'Market Rate',
      status: {
        badge: 'light-danger',
        label: 'Closed'
      },
      price: '$10',
      action: [
        {
          icon: 'eye',
          textcls: 'View Details',
          // Use relative URL or route
          link: '/Disputedetails', // Replace with the correct route for your case details page
        },
      ],
    },
    {
      name: 'DP456789234514',
      image: 'Unauthorized transaction',
      status: {
        badge: 'light-warning',
        label: 'Pending'
      },
      price: '$10',
      action: [
        {
          icon: 'eye',
          textcls: 'View Details',
          // Use relative URL or route
          link: '/Disputedetails', // Replace with the correct route for your case details page
        },
      ],
    },
    {
      name: 'DP456789234515',
      image: 'Non-receipt of goods',
      status: {
        badge: 'light-danger',
        label: 'Cancel'
      },
      price: '$10',
      action: [
        {
          icon: 'eye',
          textcls: 'View Details',
          // Use relative URL or route
          link: '/Disputedetails', // Replace with the correct route for your case details page
        },
      ],
    },
    {
      name: 'DP456789234516',
      image: 'Non-receipt of goods',
      status: {
        badge: 'light-success',
        label: 'Success'
      },
      price: '$10',
      action: [
        {
          icon: 'eye',
          textcls: 'View Details',
          // Use relative URL or route
          link: '/Disputedetails', // Replace with the correct route for your case details page
        },
      ],
    },
    {
      name: 'DP456789234517',
      image: 'Non-receipt of goods',
      status: {
        badge: 'light-danger',
        label: 'Cancel'
      },
      price: '$10',
      action: [
        {
          icon: 'eye',
          textcls: 'View Details',
          // Use relative URL or route
          link: '/Disputedetails', // Replace with the correct route for your case details page
        },
      ],
    },
    
  ]
};

export default ProductData;
