import { SimpleGrid } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import Topicard from '../../Components/Topic Card/Topicard';
import { getQuestionCountsApi } from '../../api';
import { topic } from '../../Components/Topic Card/topicData';

const Dashboard = () => {
  const [topicCards, setTopicCards] = useState([]);

  useEffect(() => {
    const fetchQuestionCounts = async () => {
      try {
        const response = await getQuestionCountsApi();
        const totalQuestions = response.data.message.total;
        const cards = topic(totalQuestions);
        setTopicCards(cards);
      } catch (error) {
        console.error("Failed to fetch question counts:", error);
      }
    };

    fetchQuestionCounts();
  }, []);
  return (
    <div>
      <Navbar />
      <SimpleGrid w={['250px', '500px', '90%']} m='40px auto' columns={[1, 2, 2, 3]} spacing={10} >
        {
          topicCards.map((item) =>
            <Topicard
              key={item.topic}
              topic={item.topic}
              offset={item.offset}
            />)
        }
      </SimpleGrid>
    </div>
  )
}

export default Dashboard