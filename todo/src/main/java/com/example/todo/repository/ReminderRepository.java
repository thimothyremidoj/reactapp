package com.example.todo.repository;

import com.example.todo.entity.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReminderRepository extends JpaRepository<Reminder, Long> {
    List<Reminder> findByTaskId(Long taskId);
    List<Reminder> findByReminderTimeBeforeAndSentFalse(LocalDateTime time);
    @Modifying
    @Query(value = "DELETE FROM reminders WHERE task_id = ?1", nativeQuery = true)
    void deleteByTaskId(Long taskId);
}
