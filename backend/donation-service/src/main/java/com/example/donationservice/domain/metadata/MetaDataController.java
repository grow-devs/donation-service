package com.example.donationservice.domain.metadata;

import com.example.donationservice.common.dto.Result;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/meta")
public class MetaDataController {
    private final MeteDataService meteDataService;

    @GetMapping("/totalAmount")
    public ResponseEntity<Result> getTotalAmount(){

        return ResponseEntity.ok().body(
                Result.builder()
                        .message("총 모금액 조회를 성공했습니다.")
                        .data(meteDataService.getTotalAmount())
                        .build()
        );
    }

    @GetMapping("/totalDonors")
    public ResponseEntity<Result> getTotalDonors(){

        return ResponseEntity.ok().body(
                Result.builder()
                        .message("총 후원자 수 조회를 성공했습니다.")
                        .data(meteDataService.getTotalDonors())
                        .build()
        );
    }

    @GetMapping("/firstDonation")
    public ResponseEntity<Result> getfirstDonation(){

        return ResponseEntity.ok().body(
                Result.builder()
                        .message("오늘 처음 기부의 정보 조회를 성공했습니다.")
                        .data(meteDataService.getfirstDonation())
                        .build()
        );
    }
}
