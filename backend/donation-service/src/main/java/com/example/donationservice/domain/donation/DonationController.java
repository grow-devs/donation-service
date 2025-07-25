package com.example.donationservice.domain.donation;

import com.example.donationservice.common.dto.Result;
import com.example.donationservice.domain.donation.dto.DonationDto;
import com.example.donationservice.domain.user.CustomUserDetail;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/donation")
public class DonationController {

    private final DonationService donationService;

    @PostMapping
    public ResponseEntity<Result> createDonation(@AuthenticationPrincipal CustomUserDetail userDetail,
                                                 @RequestBody DonationDto.createRequest createRequest){
        donationService.createDonation(userDetail.getUserId(), createRequest);
        return ResponseEntity.ok(
                Result.builder()
                        .message("기부 생성 성공")
                        .data(null)
                        .build()
        );

    }

    @GetMapping("/{postId}")
    public ResponseEntity<Result> getDonationsByPostId(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @PathVariable Long postId,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<DonationDto.response> response = donationService.getDonationsByPostId(userDetail.getUserId(), postId, pageable);
        return ResponseEntity.ok(
                Result.builder()
                        .message("기부 조회 성공")
                        .data(response)
                        .build()
        );
    }
}
